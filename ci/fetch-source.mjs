// ============================================================================
// Fetch the source snapshot named in build.json and unpack it.
//
//   node ci/fetch-source.mjs <dest-dir>
//
// build.json names an asset of a DRAFT release in this repository (drafts are
// visible to maintainers only) and the SHA-256 it must have. The job's own
// token can read drafts because the workflow is granted contents: write.
// ============================================================================
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const dest = resolve(process.argv[2] ?? "src");
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN;
const build = JSON.parse(readFileSync("build.json", "utf8"));
const api = (path, init = {}) =>
  fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28", ...(init.headers ?? {}) },
  });

const rel = await api(`/repos/${repo}/releases/${build.source.release_id}`);
if (!rel.ok) throw new Error(`source release ${build.source.release_id}: HTTP ${rel.status}`);
const asset = (await rel.json()).assets.find((a) => a.name === build.source.asset);
if (!asset) throw new Error(`source asset ${build.source.asset} not found`);

const res = await api(`/repos/${repo}/releases/assets/${asset.id}`, { headers: { Accept: "application/octet-stream" } });
if (!res.ok) throw new Error(`download: HTTP ${res.status}`);
const bytes = Buffer.from(await res.arrayBuffer());
const sha = createHash("sha256").update(bytes).digest("hex");
if (sha !== build.source.sha256) throw new Error(`source snapshot hash ${sha} does not match build.json ${build.source.sha256}`);

const tgz = join(tmpdir(), "monitor-source.tgz");
writeFileSync(tgz, bytes);
mkdirSync(dest, { recursive: true });
// Windows: the system's bsdtar. Git's GNU tar would read "D:\..." as a remote host.
const tar = process.platform === "win32" ? join(process.env.SystemRoot ?? "C:\\Windows", "System32", "tar.exe") : "tar";
execFileSync(tar, ["-xzf", tgz, "-C", dest], { stdio: "inherit" });
console.log(`source ${build.source.asset} (${(bytes.length / 1024).toFixed(0)} KB, sha256 ${sha}) -> ${dest}`);
console.log(`build: ${build.label ?? "(no label)"}`);
