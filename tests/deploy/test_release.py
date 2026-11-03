import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import socket

spec = importlib.util.spec_from_file_location("breero_release", Path(__file__).parents[2] / "deploy/breero/release.py")
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)


class ReleaseTests(unittest.TestCase):
    def test_ico_asset_is_collected_without_relaxing_executable_rejection(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); source=root / "input"; source.mkdir()
            icon=b"supplied icon bytes"
            (source / "favicon-hash.ico").write_bytes(icon)
            manifest=release.merge_assets([source],root / "assets")
            self.assertEqual(manifest["favicon-hash.ico"]["bytes"],len(icon))
            self.assertEqual((root / "assets/favicon-hash.ico").read_bytes(),icon)
            (source / "favicon.exe").write_bytes(b"untrusted")
            with self.assertRaisesRegex(ValueError,"Unsafe asset"):
                release.merge_assets([source],root / "rejected")
            self.assertFalse((root / "rejected").exists())

    def test_identical_assets_deduplicate_but_conflicting_bytes_do_not_publish(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            first, second, output = root / "first", root / "second", root / "assets"
            first.mkdir(); second.mkdir()
            (first / "index-abc.js").write_bytes(b"same bytes")
            (second / "index-abc.js").write_bytes(b"same bytes")
            (second / "style-def.css").write_bytes(b"body{}")
            manifest = release.merge_assets([first, second], output)
            self.assertEqual(len(manifest), 2)
            self.assertEqual((output / "index-abc.js").read_bytes(), b"same bytes")
            (second / "index-abc.js").write_bytes(b"conflicting bytes")
            conflict_output = root / "conflicting-output"
            with self.assertRaisesRegex(ValueError, "collision"):
                release.merge_assets([first, second], conflict_output)
            self.assertFalse(conflict_output.exists())

    def test_asset_directories_and_nonasset_files_fail_closed(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / "source"; source.mkdir()
            (source / "secret.json").write_text("{}")
            with self.assertRaises(ValueError):
                release.merge_assets([source], Path(tmp) / "assets")

    def test_unrelated_compose_project_container_is_never_adopted(self):
        release.assert_owned([])
        release.assert_owned([{"Config":{"Labels":{"com.docker.compose.project":"breero-public","codestra.project":"breero-public","com.docker.compose.service":"home"}}}])
        for labels in [{"com.docker.compose.project":"breero-public"},{"com.docker.compose.project":"other","codestra.project":"breero-public"}]:
            with self.assertRaisesRegex(ValueError, "ownership"):
                release.assert_owned([{"Config":{"Labels":labels}}])

    def test_failed_readiness_does_not_change_current_release(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); old=root / "old"; new=root / "new"
            old.mkdir(); new.mkdir()
            current=root / "current"
            try:
                current.symlink_to(old, target_is_directory=True)
            except OSError:
                self.skipTest("Windows symlink privilege unavailable; run on target Linux")
            def failed_check(_):
                raise RuntimeError("readiness failed")
            with self.assertRaisesRegex(RuntimeError, "readiness"):
                release.switch_current(new, current, failed_check)
            self.assertEqual(current.resolve(), old)

    def test_failed_first_readiness_does_not_create_current(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); target=root / "new"; target.mkdir()
            def failed_check(_):
                raise RuntimeError("readiness failed")
            with self.assertRaisesRegex(RuntimeError, "readiness"):
                release.switch_current(target, root / "current", failed_check)
            self.assertFalse((root / "current").exists())
            self.assertEqual(list(root.glob(".current-*")), [])

    def test_stopped_owned_container_cannot_mask_another_port_occupant(self):
        labels={"com.docker.compose.project":"breero-public","codestra.project":"breero-public"}
        stopped={"Config":{"Labels":labels},"State":{"Running":False},"HostConfig":{"PortBindings":{"4173/tcp":[{"HostIp":"127.0.0.1","HostPort":"6100"}]}}}
        def docker_read(args):
            if args[1] == "ps": return "owned-container"
            if args[1] == "inspect": return json.dumps([stopped])
            if args[1:3] == ["network","ls"]: return ""
            raise AssertionError(args)
        with socket.socket() as occupant:
            occupant.bind(("127.0.0.1",6100))
            occupant.listen()
            with patch.object(release,"command",side_effect=docker_read):
                with self.assertRaisesRegex(ValueError,"another process"):
                    release.ownership_preflight()

    def test_asset_symlink_is_rejected_before_copy(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); source=root / "input"; source.mkdir()
            outside=root / "outside.js"; outside.write_bytes(b"private")
            try:
                (source / "asset.js").symlink_to(outside)
            except OSError:
                self.skipTest("Windows symlink privilege unavailable; required Linux CI covers this")
            with self.assertRaisesRegex(ValueError,"Unsafe asset"):
                release.merge_assets([source], root / "assets")
            self.assertFalse((root / "assets").exists())

    def test_mixed_runtime_revision_or_image_cannot_pass_readiness(self):
        revision="a" * 40
        names=["home"] + ["service-" + str(i) for i in range(30)]
        data={"revision":revision,"backendImage":"backend:" + revision,"pages":[{"slug":name,"image":name + ":" + revision} for name in names]}
        expected={"backend":data["backendImage"],**{p["slug"]:p["image"] for p in data["pages"]}}
        containers=[]; images={}
        for index,(name,image) in enumerate(expected.items()):
            image_id="sha256:" + str(index).zfill(64)
            images[image]=image_id
            containers.append({"Config":{"Image":image,"Labels":{"com.docker.compose.project":"breero-public","com.docker.compose.service":name,"codestra.project":"breero-public","codestra.release":revision}},"State":{"Running":True,"Health":{"Status":"healthy"}},"Image":image_id})
        release.validate_runtime(data,containers,images)
        for change in [lambda c:c[0]["Config"]["Labels"].update({"codestra.release":"b" * 40}),lambda c:c[1].update({"Image":"sha256:unexpected"}),lambda c:c.pop(),lambda c:c[0]["State"].update({"Running":False})]:
            modified=json.loads(json.dumps(containers)); change(modified)
            with self.assertRaises(ValueError):
                release.validate_runtime(data,modified,images)

    def test_unrelated_network_label_is_rejected(self):
        def docker_read(args):
            if args[1] == "ps": return ""
            if args[1:3] == ["network","ls"]: return "network-id"
            if args[1:3] == ["network","inspect"]:
                return json.dumps([{"Labels":{"codestra.project":"breero-public","com.docker.compose.project":"some-other-project"}}])
            raise AssertionError(args)
        with patch.object(release,"command",side_effect=docker_read):
            with self.assertRaisesRegex(ValueError,"network ownership"):
                release.ownership_preflight()

    def test_failed_start_restores_previous_runtime_and_keeps_pointer(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); old=root / "old"; new=root / "new"
            old.mkdir(); new.mkdir(); current=root / "current"
            try:
                current.symlink_to(old,target_is_directory=True)
            except OSError:
                self.skipTest("Windows symlink privilege unavailable; required Linux CI covers this")
            previous={"revision":"old"}; candidate={"revision":"new"}
            calls=[]
            def start(data): calls.append(("start",data["revision"]))
            def check(data):
                calls.append(("check",data["revision"]))
                if data["revision"] == "new": raise RuntimeError("candidate not ready")
            with patch.object(release,"BASE",root),patch.object(release,"load_release",return_value=previous),patch.object(release,"compose_up",side_effect=start),patch.object(release,"check_release",side_effect=check):
                with self.assertRaisesRegex(RuntimeError,"previous Breero stack restored"):
                    release.start_local(candidate)
            self.assertEqual(calls,[("start","new"),("check","new"),("start","old"),("check","old")])
            self.assertEqual(current.resolve(),old)

    def test_foreign_image_tag_is_not_overwritten(self):
        data={"sourceDir":"/trusted/source","revision":"a" * 40,"backendImage":"local/breero-backend:" + "a" * 40,"pages":[]}
        calls=[]
        def read_command(args,**kwargs):
            calls.append(args)
            if args[0] == "git": return data["revision"] if "rev-parse" in args else ""
            if args[1:3] == ["image","ls"]: return "foreign-image-id"
            if args[1:3] == ["image","inspect"]: return json.dumps([{"Config":{"Labels":{"owner":"someone-else"}}}])
            if args[1] == "build": return "would overwrite foreign image"
            raise AssertionError(args)
        with patch.object(release,"command",side_effect=read_command):
            with self.assertRaisesRegex(ValueError,"image ownership"):
                release.build(data)
        self.assertFalse(any(args[:2] == ["docker","build"] for args in calls))

    def test_dangling_asset_manifest_symlink_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            try:
                (root / "assets.json").symlink_to(root / "outside-does-not-exist")
            except OSError:
                self.skipTest("Windows symlink privilege unavailable; required Linux CI covers this")
            with self.assertRaisesRegex(ValueError,"symlink"):
                release.reject_symlinks(root)


if __name__ == "__main__":
    unittest.main()
