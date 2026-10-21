// ============================================================================
// After a build: report, keep the logs where only maintainers can read them,
// and - when this runner publishes and every stage passed - attach the release
// installers to the draft release named in build.json.
//
//   node ci/publish.mjs <out-dir>          (env: GH_TOKEN, JOB_ID, PUBLISH)
//
// The logs go to the SOURCE draft (not a public workflow artifact): a public
// repository's artifacts can be downloaded by anybody signed in to GitHub.
// Installers are attached to a draft too; a person publishes the release.
// ============================================================================
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const out = resolve(process.argv[2] ?? "out");
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN;
const jobId = process.env.JOB_ID ?? "job";
const runTag = `${process.env.GITHUB_RUN_ID ?? "0"}-${process.env.GITHUB_RUN_ATTEMPT ?? "1"}`;
const build = JSON.parse(readFileSync("build.json", "utf8"));
const headers = { Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28" };
const tar = process.platform === "win32" ? join(process.env.SystemRoot ?? "C:\\Windows", "System32", "tar.exe") : "tar";

async function assetsOf(releaseId) {
  const r = await fetch(`https://api.github.com/repos/${repo}/releases/${releaseId}/assets?per_page=100`, { headers });
  if (!r.ok) throw new Error(`list assets of ${releaseId}: HTTP ${r.status}`);
  return r.json();
}

async function upload(releaseId, file, name, existing) {
  const old = existing.find((a) => a.name === name);
  if (old) await fetch(`https://api.github.com/repos/${repo}/releases/assets/${old.id}`, { method: "DELETE", headers });
  const body = readFileSync(file);
  const r = await fetch(`https://uploads.github.com/repos/${repo}/releases/${releaseId}/assets?name=${encodeURIComponent(name)}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/octet-stream" },
    body,
  });
  if (!r.ok) throw new Error(`upload ${name}: HTTP ${r.status} ${await r.text()}`);
  console.log(`uploaded ${name} (${(body.length / 1024 / 1024).toFixed(1)} MB) to release ${releaseId}`);
}

const results = existsSync(join(out, "results.txt")) ? readFileSync(join(out, "results.txt"), "utf8") : "(no results: the build did not start)\n";
const passed = /^PASS/m.test(results) && !/^FAIL/m.test(results);
console.log(results);

// The step summary: the stage table, readable without opening the log.
if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results
    .trim()
    .split(/\r?\n/)
    .map((l) => l.split(/\s{2,}/))
    .map(([s, n, t, x]) => `| ${s ?? ""} | ${n ?? ""} | ${t ?? ""} | ${x ?? ""} |`);
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### ${jobId}\n\n| | stage | time | |\n|---|---|---|---|\n${rows.join("\n")}\n`);
}

// Logs -> the source draft.
if (existsSync(out)) {
  const logs = join(tmpdir(), `logs-${jobId}-${runTag}.tgz`);
  const parts = ["results.txt", "runner.txt", "logs"].filter((p) => existsSync(join(out, p)));
  if (parts.length) {
    execFileSync(tar, ["-czf", logs, "-C", out, ...parts]);
    await upload(build.source.release_id, logs, `logs-${jobId}-${runTag}.tgz`, await assetsOf(build.source.release_id));
  }
}

// Installers -> the target draft, only from a publishing runner whose every stage passed.
const target = build.target_release_id;
const dir = join(out, "release-installers");
if (process.env.PUBLISH === "true" && target && passed && existsSync(dir)) {
  const existing = await assetsOf(target);
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (!statSync(p).isFile()) continue;
    const name = f === "SHA256SUMS.part.txt" ? `SHA256SUMS-${jobId}.txt` : f;
    await upload(target, p, name, existing);
  }
} else {
  console.log(`not publishing installers (publish=${process.env.PUBLISH}, target=${target ?? "none"}, passed=${passed})`);
}
