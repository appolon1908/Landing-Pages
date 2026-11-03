import importlib.util
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import enroll


class EnrollmentTests(unittest.TestCase):
    def test_host_keys_only_from_valid_metadata(self):
        self.assertEqual(enroll.host_keys({'ssh_keys': ['ssh-ed25519 AAAA']}), 'github.com ssh-ed25519 AAAA\n')

    def test_injected_host_key_rejected(self):
        with self.assertRaises(enroll.PublishError):
            enroll.host_keys({'ssh_keys': ['ssh-ed25519 AAAA\nmalicious-host AAAA']})

    def test_empty_host_keys_rejected(self):
        with self.assertRaises(enroll.PublishError):
            enroll.host_keys({})

    def test_symlink_credential_directory_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / 'target'
            target.mkdir()
            link = Path(tmp) / 'link'
            link.symlink_to(target)
            with self.assertRaises(enroll.PublishError):
                enroll.private_directory(link)

    def test_key_generation_is_idempotent(self):
        with tempfile.TemporaryDirectory() as tmp:
            key = Path(tmp) / 'agent'
            original = enroll.make_key(key, 'test')
            self.assertEqual(enroll.make_key(key, 'test'), original)
            key.chmod(0o644)
            with self.assertRaisesRegex(enroll.PublishError, 'permissions'):
                enroll.make_key(key, 'test')

    def test_registration_finds_key_on_later_page(self):
        public = 'ssh-ed25519 TARGET comment'
        calls = []
        def service(path, data=None):
            calls.append((path, data))
            if path.endswith('page=1'):
                return [{'id': i, 'key': f'ssh-ed25519 KEY{i}', 'title': f'old{i}'} for i in range(100)]
            return [{'id': 101, 'key': public, 'read_only': False}]
        with patch.object(enroll, 'api', service):
            self.assertEqual(enroll.ensure_registered('repo/keys', 'new', public, writable=True), 101)
        self.assertTrue(all(payload is None for _, payload in calls))

    def test_readonly_key_never_replaced(self):
        public = 'ssh-ed25519 TARGET'
        with patch.object(enroll, 'api', return_value=[{'id': 1, 'key': public, 'read_only': True}]) as request:
            with self.assertRaisesRegex(enroll.PublishError, 'read-only'):
                enroll.ensure_registered('repo/keys', 'new', public, writable=True)
            self.assertEqual(request.call_count, 1)

    def test_title_collision_never_replaced(self):
        with patch.object(enroll, 'api', return_value=[{'id': 1, 'title': 'agent', 'key': 'ssh-ed25519 OTHER'}]) as request:
            with self.assertRaisesRegex(enroll.PublishError, 'another key'):
                enroll.ensure_registered('repo/keys', 'agent', 'ssh-ed25519 TARGET', writable=True)
            self.assertEqual(request.call_count, 1)

    def test_retry_after_registration_does_not_duplicate_key(self):
        keys = []
        def service(path, data=None):
            if data is None:
                return keys.copy()
            created = dict(data, id=11)
            keys.append(created)
            return created
        with patch.object(enroll, 'api', service):
            first = enroll.ensure_registered('repo/keys', 'agent', 'ssh-ed25519 TARGET', writable=True)
            second = enroll.ensure_registered('repo/keys', 'agent', 'ssh-ed25519 TARGET', writable=True)
        self.assertEqual((first, second, len(keys)), (11, 11, 1))
        self.assertFalse(keys[0]['read_only'])


if __name__ == '__main__':
    unittest.main()
