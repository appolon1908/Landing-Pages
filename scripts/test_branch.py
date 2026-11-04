import importlib.util
import json
import unittest
from pathlib import Path

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("check_branch", root / "scripts/check_branch.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
policy = json.loads((root / "branch-policy.json").read_text())


class BranchPolicyTests(unittest.TestCase):
    def test_images_use_only_their_declared_subsection(self):
        images = "subsection/public--images"
        child = "atomic/breero-image-assets-20261103"
        self.assertTrue(module.allowed(images, child, policy))
        self.assertTrue(module.allowed(policy["section"], images, policy))
        for head, base in [
            (child, policy["subsection"]),
            (child, policy["section"]),
            (child, "development"),
            ("atomic/unrelated", images),
            ("atomic/breero-image-assets-20261103-extra", images),
            (images, policy["subsection"]),
            (images, "development"),
            (images, "production"),
        ]:
            with self.subTest(head=head, base=base):
                self.assertFalse(module.allowed(base, head, policy))

    def test_only_adjacent_declared_boundaries(self):
        chain = ["atomic/example", policy["subsection"], policy["section"], "development", "testing", "staging", "production"]
        for index in range(len(chain) - 1):
            with self.subTest(head=chain[index]):
                self.assertTrue(module.allowed(chain[index + 1], chain[index], policy))
        for head, base in [("atomic/example", "main"), ("atomic/example", "development"), ("atomic/example", "subsection/unrelated"), (policy["subsection"], "development"), ("development", "production"), ("testing", "production"), ("main", "production"), ("atomic/", policy["subsection"])]:
            with self.subTest(head=head, base=base):
                self.assertFalse(module.allowed(base, head, policy))


if __name__ == "__main__":
    unittest.main()
