/* 用 macOS 自带 say 生成预录英语配音（Samantha）与中文欢迎语（Tingting）
   用法：先跑 tests/collect_audio.html 得到 /tmp/audio_strings.json，再 node tools/gen_audio.mjs */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const input = process.argv[2] || "/tmp/audio_strings.json";
const strs = JSON.parse(fs.readFileSync(input, "utf8"));
const zhTexts = ["欢迎来到快乐小屋！"];
const norm = (s) => String(s).replace(/\s+/g, " ").trim().toLowerCase();
const outDir = path.join(ROOT, "audio", "clips");
fs.mkdirSync(outDir, { recursive: true });

function gen(text, voice, rate) {
  const hash = crypto.createHash("md5").update(norm(text)).digest("hex").slice(0, 10);
  const rel = "audio/clips/" + hash + ".m4a";
  const abs = path.join(ROOT, rel);
  if (fs.existsSync(abs)) return rel;
  const tmp = "/tmp/u4say_" + hash + ".aiff";
  execFileSync("say", ["-v", voice, "-r", String(rate), "-o", tmp, "--", text], { stdio: "ignore" });
  execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "32000", tmp, abs], { stdio: "ignore" });
  try { fs.unlinkSync(tmp); } catch (e) { }
  return rel;
}

const manifest = {};
let n = 0;
for (const s of strs) {
  if (!/[A-Za-z]/.test(s) || s.length > 220) continue;
  const key = norm(s);
  if (manifest[key]) continue;
  manifest[key] = gen(s, "Samantha", 145);
  n++;
  if (n % 20 === 0) console.log("generated", n);
}
const zhManifest = {};
for (const s of zhTexts) zhManifest[norm(s)] = gen(s, "Tingting", 150);

const body = "/* 自动生成：预录音频清单（tools/gen_audio.mjs 生成，请勿手改） */\n" +
  "window.U4_AUDIO = " + JSON.stringify(manifest) + ";\n" +
  "window.U4_AUDIO_ZH = " + JSON.stringify(zhManifest) + ";\n";
fs.writeFileSync(path.join(ROOT, "js", "audio-data.js"), body);
console.log("TOTAL", Object.keys(manifest).length, "EN |", Object.keys(zhManifest).length, "ZH");
