import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "runway-hero");
const apiBase = "https://api.dev.runwayml.com/v1";
const runwayVersion = "2024-11-06";

const prompts = [
  {
    id: "clinic-arrival",
    prompt:
      "Premium cinematic hero film for a luxury preventive longevity clinic with a refined clinical technology atmosphere. Single continuous 10 second photorealistic shot. Slow smooth dolly through a calm private diagnostics suite: ivory stone surfaces, deep emerald accents, warm gold practical lighting, glass partitions, brushed metal equipment, quiet medical precision. Show a high-end full-body diagnostic scanner and soft abstract monitor glow with no readable UI. Human presence only as distant lab coat silhouettes and hands, no clear faces. Leave clean negative space on the left for website headline text. Shallow depth of field, 35mm cinema lens, natural motion blur, documentary-luxury healthcare brand film. Avoid text, logos, fake signage, close-up faces, distorted hands, sci-fi holograms, floating UI, neon cyberpunk, generic hospital stock, blue emergency lighting, clutter, jitter, flicker, surreal objects, obvious AI artifacts.",
  },
  {
    id: "diagnostics-detail",
    prompt:
      "Premium cinematic hero film for a luxury preventive longevity clinic, real-world clinical technology detail. Single continuous 10 second photorealistic macro-to-medium shot. Slow controlled camera slide across gloved hands preparing a small biometric wearable sensor on a sterile tray, glass blood vials in a minimal rack, brushed metal diagnostic equipment, soft monitor glow in the background with no readable UI. Ivory, deep emerald, warm gold, polished glass, precise quiet medicine. Hands only, no faces. Leave calm negative space on the left side for headline text. 35mm cinema lens, shallow depth of field, elegant reflections, natural motion blur, premium documentary healthcare brand film. Avoid readable text, logos, fake labels, distorted hands, sci-fi interfaces, holograms, blue hospital stock look, clutter, jitter, flicker, surreal equipment, cartoonish details, obvious AI smoothness.",
  },
  {
    id: "physician-review",
    prompt:
      "Premium cinematic hero film for a luxury preventive longevity clinic, clinically credible and human but restrained. Single continuous 10 second photorealistic shot. Slow dolly in an elegant consultation and diagnostics room: physician silhouette in a white coat reviews abstract health imagery on a muted monitor while a patient sits softly out of focus, posture and hands only, no clear faces. A compact diagnostic scanner, glass, ivory stone, deep emerald accents, brushed metal, warm gold lighting. The mood is calm, intelligent, expensive, precise, and preventive. Leave refined negative space on the left for website headline text. 35mm cinema lens, shallow depth of field, soft reflections, natural motion blur. Avoid readable text, logos, fake signage, close-up faces, distorted hands, sci-fi holograms, floating UI, neon, generic hospital stock, clutter, jitter, flicker, obvious AI artifacts.",
  },
];

function loadEnvFile(contents) {
  const result = {};
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const equals = line.indexOf("=");
    if (equals === -1) continue;
    const key = line.slice(0, equals).trim();
    let value = line.slice(equals + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

async function runwayFetch(endpoint, { method = "GET", body } = {}) {
  const response = await fetch(`${apiBase}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Runway-Version": runwayVersion,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const error = new Error(`Runway API ${response.status} ${response.statusText}`);
    error.payload = payload;
    throw error;
  }

  return payload;
}

function getOutputUrl(task) {
  const output = task.output;
  if (Array.isArray(output)) {
    const first = output[0];
    if (typeof first === "string") return first;
    if (first?.uri) return first.uri;
    if (first?.url) return first.url;
  }
  if (typeof output === "string") return output;
  if (output?.uri) return output.uri;
  if (output?.url) return output.url;
  return null;
}

async function download(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

const env = loadEnvFile(await readFile(path.join(root, ".env.local"), "utf8"));
const apiKey = process.env.RUNWAYML_API_SECRET || env.RUNWAYML_API_SECRET;

if (!apiKey) {
  throw new Error("RUNWAYML_API_SECRET is missing.");
}

await mkdir(outDir, { recursive: true });
await writeFile(
  path.join(outDir, "prompts.json"),
  JSON.stringify(
    prompts.map(({ id, prompt }) => ({ id, prompt })),
    null,
    2,
  ),
);

const tasks = [];
for (const candidate of prompts) {
  console.log(`Creating ${candidate.id}...`);
  const task = await runwayFetch("/text_to_video", {
    method: "POST",
    body: {
      model: "gen4.5",
      promptText: candidate.prompt,
      ratio: "1280:720",
      duration: 10,
    },
  });

  tasks.push({ ...candidate, taskId: task.id, latest: task });
  await writeFile(path.join(outDir, `${candidate.id}.task.json`), JSON.stringify(task, null, 2));
  console.log(`${candidate.id}: ${task.id}`);
}

const pending = new Map(tasks.map((task) => [task.taskId, task]));
const terminal = new Set(["SUCCEEDED", "FAILED", "CANCELED", "CANCELLED"]);

while (pending.size > 0) {
  await sleep(15000);

  for (const [taskId, candidate] of [...pending.entries()]) {
    const task = await runwayFetch(`/tasks/${taskId}`);
    candidate.latest = task;
    await writeFile(
      path.join(outDir, `${candidate.id}.latest.json`),
      JSON.stringify(task, null, 2),
    );

    const status = task.status || "UNKNOWN";
    console.log(`${candidate.id}: ${status}`);

    if (!terminal.has(status)) continue;
    pending.delete(taskId);

    if (status !== "SUCCEEDED") {
      console.error(`${candidate.id} failed.`);
      continue;
    }

    const outputUrl = getOutputUrl(task);
    if (!outputUrl) {
      console.error(`${candidate.id} succeeded without a downloadable output.`);
      continue;
    }

    const filePath = path.join(outDir, `${candidate.id}.mp4`);
    await download(outputUrl, filePath);
    console.log(`${candidate.id}: downloaded ${filePath}`);
  }
}

await writeFile(
  path.join(outDir, "summary.json"),
  JSON.stringify(
    tasks.map(({ id, taskId, latest }) => ({
      id,
      taskId,
      status: latest?.status,
      output: latest?.output,
      failure: latest?.failure,
    })),
    null,
    2,
  ),
);
