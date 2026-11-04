import { spawnSync } from "node:child_process";

for (const [program, args] of [
  [process.execPath, ["--test", "tests/deploy/release.test.mjs"]],
  [
    process.platform === "win32" ? "python" : "python3",
    [
      "-B",
      "-m",
      "unittest",
      "discover",
      "-s",
      "tests/deploy",
      "-p",
      "test_release.py",
    ],
  ],
]) {
  const result = spawnSync(program, args, { stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
