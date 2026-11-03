"""Release authorization must bind checks to the exact protected source head."""
import copy
import unittest

from image_gate import GateError, REQUIRED, authorize, checks_ready


class GateTests(unittest.TestCase):
    def setUp(self):
        self.sha = 'a' * 40
        self.repo = 'appolon1908/Landing-Pages'
        self.run = {'event': 'push', 'conclusion': 'success', 'head_sha': self.sha,
                    'head_branch': 'development', 'head_repository': {'full_name': self.repo}}
        self.branch = {'protected': True, 'commit': {'sha': self.sha}}
        self.runs = [{**copy.deepcopy(self.run), 'path': path, 'status': 'completed',
                      'id': index, 'run_number': 1, 'run_attempt': 1}
                     for index, path in enumerate(REQUIRED, 1)]

    def test_exact_protected_head(self):
        self.assertEqual(authorize(self.run, self.branch, self.repo), ('development', self.sha))
        self.assertTrue(checks_ready(self.runs, self.repo, 'development', self.sha))

    def test_fork_is_rejected(self):
        self.run['head_repository']['full_name'] = 'someone/Landing-Pages'
        with self.assertRaises(GateError):
            authorize(self.run, self.branch, self.repo)

    def test_pull_request_is_rejected(self):
        self.run['event'] = 'pull_request'
        with self.assertRaises(GateError):
            authorize(self.run, self.branch, self.repo)

    def test_nonrelease_branch_is_rejected(self):
        self.run['head_branch'] = 'atomic/change'
        with self.assertRaises(GateError):
            authorize(self.run, self.branch, self.repo)

    def test_unprotected_branch_is_rejected(self):
        self.branch['protected'] = False
        with self.assertRaises(GateError):
            authorize(self.run, self.branch, self.repo)

    def test_stale_source_is_rejected(self):
        self.branch['commit']['sha'] = 'b' * 40
        with self.assertRaises(GateError):
            authorize(self.run, self.branch, self.repo)

    def test_failed_trigger_is_rejected(self):
        self.run['conclusion'] = 'failure'
        with self.assertRaises(GateError):
            authorize(self.run, self.branch, self.repo)

    def test_missing_or_wrong_head_check_waits(self):
        self.assertFalse(checks_ready(self.runs[:-1], self.repo, 'development', self.sha))
        self.runs[0]['head_sha'] = 'b' * 40
        self.assertFalse(checks_ready(self.runs, self.repo, 'development', self.sha))

    def test_failed_latest_run_cannot_reuse_old_success(self):
        newer = {**self.runs[0], 'id': 99, 'run_number': 2, 'conclusion': 'failure'}
        with self.assertRaises(GateError):
            checks_ready([newer] + self.runs, self.repo, 'development', self.sha)

    def test_queued_latest_run_waits(self):
        newer = {**self.runs[0], 'id': 99, 'run_number': 2, 'status': 'queued', 'conclusion': None}
        self.assertFalse(checks_ready(self.runs + [newer], self.repo, 'development', self.sha))

    def test_foreign_and_pr_checks_do_not_authorize(self):
        for run in self.runs:
            run['event'] = 'pull_request'
        self.assertFalse(checks_ready(self.runs, self.repo, 'development', self.sha))

    def test_documented_path_with_ref_suffix(self):
        for run in self.runs:
            run['path'] += '@development'
        self.assertTrue(checks_ready(self.runs, self.repo, 'development', self.sha))

    def test_similar_workflow_path_does_not_count(self):
        self.runs[0]['path'] += '.other@development'
        self.assertFalse(checks_ready(self.runs, self.repo, 'development', self.sha))


if __name__ == '__main__':
    unittest.main()
