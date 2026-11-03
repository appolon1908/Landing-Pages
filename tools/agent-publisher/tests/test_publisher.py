import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


MODULE = Path(__file__).resolve().parents[1] / 'publisher.py'


class PublisherTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.repo = self.root / 'repo'
        self.remote = self.root / 'remote.git'
        self.key = self.root / 'signing'
        self.run_cmd('ssh-keygen', '-q', '-t', 'ed25519', '-N', '', '-f', str(self.key))
        self.signers = self.root / 'allowed_signers'
        self.signers.write_text('agent@example.test ' + self.key.with_suffix('.pub').read_text())
        self.run_cmd('git', 'init', '--bare', '-q', str(self.remote))
        self.run_cmd('git', 'init', '-q', '-b', 'main', str(self.repo))
        for name, value in [('user.name', 'Test agent'), ('user.email', 'agent@example.test'),
                            ('gpg.format', 'ssh'), ('user.signingkey', str(self.key)),
                            ('gpg.ssh.allowedSignersFile', str(self.signers)), ('commit.gpgsign', 'true')]:
            self.git('config', name, value)
        self.git('remote', 'add', 'origin', 'https://github.com/appolon1908/Landing-Pages.git')
        self.git('remote', 'add', 'test', str(self.remote))
        (self.repo / 'file').write_text('base\n')
        self.git('add', 'file')
        self.git('commit', '-qm', 'base')
        self.base = self.git('rev-parse', 'HEAD')
        self.git('push', '-q', 'test', 'HEAD:refs/heads/main')
        self.git('switch', '-qc', 'atomic/test')
        (self.repo / 'file').write_text('candidate\n')
        self.git('commit', '-qam', 'candidate')
        self.head = self.git('rev-parse', 'HEAD')
        spec = importlib.util.spec_from_file_location('publisher', MODULE)
        if not MODULE.exists():
            self.fail('publisher.py has not been implemented')
        self.mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.mod)

    def run_cmd(self, *args, check=True):
        return subprocess.run(args, text=True, capture_output=True, check=check).stdout.strip()

    def git(self, *args):
        return self.run_cmd('git', '-C', str(self.repo), *args)

    def publish(self, **kw):
        args = dict(worktree=self.repo, repository='Landing-Pages', base='main',
                    expected_base=self.base, expected_head=self.head,
                    destination=str(self.remote), allowed_signers=self.signers,
                    apply=True)
        args.update(kw)
        return self.mod.publish(**args)

    def test_signed_new_branch_and_remote_readback(self):
        result = self.publish()
        self.assertEqual(result['remote_sha'], self.head)
        self.assertEqual(self.run_cmd('git', '--git-dir', str(self.remote), 'rev-parse', 'atomic/test'), self.head)

    def test_dry_run_leaves_remote_branch_absent(self):
        result = self.publish(apply=False)
        self.assertEqual(result['status'], 'READY_TO_PUSH')
        self.assertEqual(self.run_cmd('git', 'ls-remote', str(self.remote), 'refs/heads/atomic/test'), '')

    def test_dirty_worktree_rejected(self):
        (self.repo / 'dirty').write_text('keep me')
        with self.assertRaisesRegex(self.mod.PublishError, 'dirty'):
            self.publish()
        self.assertTrue((self.repo / 'dirty').exists())

    def test_protected_branch_rejected(self):
        self.git('branch', '-m', 'production')
        with self.assertRaisesRegex(self.mod.PublishError, 'protected'):
            self.publish()

    def test_hierarchy_branch_rejected(self):
        self.git('branch', '-m', 'section/public')
        with self.assertRaisesRegex(self.mod.PublishError, 'protected'):
            self.publish()

    def test_wrong_repository_rejected(self):
        self.git('remote', 'set-url', 'origin', 'https://github.com/another/repo.git')
        with self.assertRaisesRegex(self.mod.PublishError, 'origin'):
            self.publish()

    def test_stale_parent_rejected(self):
        with self.assertRaisesRegex(self.mod.PublishError, 'parent'):
            self.publish(expected_base='a' * 40)

    def test_changed_head_rejected(self):
        with self.assertRaisesRegex(self.mod.PublishError, 'head'):
            self.publish(expected_head=self.base)

    def test_unsigned_candidate_rejected(self):
        self.git('config', 'commit.gpgsign', 'false')
        (self.repo / 'file').write_text('unsigned\n')
        self.git('commit', '-qam', 'unsigned')
        with self.assertRaisesRegex(self.mod.PublishError, 'signature'):
            self.publish(expected_head=self.git('rev-parse', 'HEAD'))

    def test_diverged_remote_rejected(self):
        self.git('push', '-q', 'test', 'HEAD:refs/heads/atomic/test')
        self.git('switch', '-qc', 'atomic/other', self.base)
        (self.repo / 'other').write_text('other\n')
        self.git('add', 'other')
        self.git('commit', '-qm', 'other')
        other = self.git('rev-parse', 'HEAD')
        self.git('branch', '-m', 'atomic/replacement')
        self.git('branch', '-D', 'atomic/test')
        self.git('branch', '-m', 'atomic/test')
        with self.assertRaisesRegex(self.mod.PublishError, 'diverg'):
            self.publish(expected_head=other)

    def test_fast_forward_existing_branch(self):
        self.publish()
        (self.repo / 'file').write_text('next\n')
        self.git('commit', '-qam', 'next')
        new = self.git('rev-parse', 'HEAD')
        self.assertEqual(self.publish(expected_head=new)['remote_sha'], new)

    def test_bad_sha_rejected(self):
        with self.assertRaisesRegex(self.mod.PublishError, 'SHA'):
            self.publish(expected_head='--all')

    def test_follow_tags_configuration_cannot_publish_tags(self):
        self.git('config', 'push.followTags', 'true')
        self.git('tag', '-a', 'unreviewed-release', '-m', 'not authorized for publication')
        self.publish()
        self.assertEqual(self.run_cmd('git', 'ls-remote', '--tags', str(self.remote)), '')

    def test_replacement_ref_cannot_hide_unsigned_commit(self):
        self.git('config', 'commit.gpgsign', 'false')
        tree = self.git('rev-parse', 'HEAD^{tree}')
        unsigned = self.git('commit-tree', tree, '-p', self.base, '-m', 'unsigned')
        self.git('update-ref', 'refs/heads/atomic/test', unsigned)
        self.git('replace', unsigned, self.head)
        with self.assertRaisesRegex(self.mod.PublishError, 'signature'):
            self.publish(expected_head=unsigned)

    def test_parent_race_reports_push_and_requires_new_review(self):
        original_run = self.mod.run
        def advance_parent(args, **kwargs):
            if 'push' in args:
                self.run_cmd('git', '--git-dir', str(self.remote), 'fetch', '-q', str(self.repo), self.head)
                self.run_cmd('git', '--git-dir', str(self.remote), 'update-ref', 'refs/heads/main', self.head)
            return original_run(args, **kwargs)
        self.mod.run = advance_parent
        with self.assertRaisesRegex(self.mod.PublishError, 'pushed.*parent advanced'):
            self.publish()
        self.assertEqual(self.run_cmd('git', '--git-dir', str(self.remote), 'rev-parse', 'atomic/test'), self.head)

    def test_graft_cannot_invent_parent_ancestry(self):
        orphan = self.git('commit-tree', '-S', self.git('rev-parse', 'HEAD^{tree}'), '-m', 'orphan')
        self.git('update-ref', 'refs/heads/atomic/test', orphan)
        (self.repo / '.git/info/grafts').write_text(orphan + ' ' + self.base + '\n')
        with self.assertRaisesRegex(self.mod.PublishError, 'parent'):
            self.publish(expected_head=orphan)

    def test_instead_of_rewrite_cannot_redirect_destination(self):
        redirect = self.root / 'redirect.git'
        self.run_cmd('git', 'clone', '--bare', '-q', str(self.remote), str(redirect))
        self.git('config', f'url.{redirect}.insteadOf', str(self.remote))
        with self.assertRaisesRegex(self.mod.PublishError, 'rewrite'):
            self.publish()
        self.assertEqual(self.run_cmd('git', 'ls-remote', str(redirect), 'refs/heads/atomic/test'), '')

    def test_push_instead_of_rewrite_cannot_redirect_destination(self):
        redirect = self.root / 'redirect.git'
        self.run_cmd('git', 'clone', '--bare', '-q', str(self.remote), str(redirect))
        self.git('config', f'url.{redirect}.pushInsteadOf', str(self.remote))
        with self.assertRaisesRegex(self.mod.PublishError, 'rewrite'):
            self.publish()
        self.assertEqual(self.run_cmd('git', 'ls-remote', str(redirect), 'refs/heads/atomic/test'), '')

    def test_existing_lock_is_preserved(self):
        lock = self.repo / '.git/codestra-publish.lock'
        lock.write_text('owned by another process')
        with self.assertRaisesRegex(self.mod.PublishError, 'lock'):
            self.publish()
        self.assertEqual(lock.read_text(), 'owned by another process')

    def test_failed_preflight_releases_only_own_lock(self):
        with self.assertRaises(self.mod.PublishError):
            self.publish(expected_head=self.base)
        self.assertFalse((self.repo / '.git/codestra-publish.lock').exists())

    def test_linked_worktree_with_spaces(self):
        linked = self.root / 'worktree with spaces'
        self.git('worktree', 'add', '-q', '-b', 'atomic/linked', str(linked), self.head)
        result = self.publish(worktree=linked, expected_branch='atomic/linked')
        self.assertEqual(result['remote_sha'], self.head)
        self.assertEqual(result['branch'], 'atomic/linked')

    def test_checkout_during_validation_cannot_redirect_push(self):
        original_run = self.mod.run
        changed = False
        def change_branch(args, **kwargs):
            nonlocal changed
            result = original_run(args, **kwargs)
            if 'verify-commit' in args and not changed:
                changed = True
                self.git('switch', '-qc', 'atomic/other', self.head)
            return result
        self.mod.run = change_branch
        with self.assertRaisesRegex(self.mod.PublishError, 'head or branch changed'):
            self.publish()
        self.assertEqual(self.run_cmd('git', 'ls-remote', str(self.remote), 'refs/heads/atomic/*'), '')


if __name__ == '__main__':
    unittest.main()
