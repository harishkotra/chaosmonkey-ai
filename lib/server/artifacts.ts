import fs from "fs";
import path from "path";
import { HeatmapPoint, ObservabilityEvent, RunArtifacts, RunHistory, TestArtifact } from "@/lib/data/artifact-types";

type JsonReporterNode = {
  title?: string;
  file?: string;
  specs?: JsonReporterSpec[];
  suites?: JsonReporterNode[];
};

type JsonReporterSpec = {
  title?: string;
  tests?: JsonReporterTest[];
};

type JsonReporterTest = {
  results?: JsonReporterResult[];
};

type JsonReporterResult = {
  status?: string;
  duration?: number;
  error?: { message?: string };
};

const HISTORY_PATH = path.join(process.cwd(), "artifacts", "run-history.json");
const LATEST_JSON_PATH = path.join(process.cwd(), "artifacts", "latest-playwright.json");

function flattenSpecs(nodes: JsonReporterNode[] | undefined, fileHint = ""): Array<{ spec: JsonReporterSpec; file: string }> {
  if (!nodes) return [];
  const out: Array<{ spec: JsonReporterSpec; file: string }> = [];
  for (const node of nodes) {
    const file = node.file ?? fileHint;
    if (node.specs) {
      for (const spec of node.specs) out.push({ spec, file });
    }
    out.push(...flattenSpecs(node.suites, file));
  }
  return out;
}

function safeReadJson(filePath: string): unknown | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function writeJson(filePath: string, data: unknown) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function collectMediaPaths(testResultsDir: string, needle: string, fileNameRegex: RegExp): string[] {
  if (!fs.existsSync(testResultsDir)) return [];
  const dirs = fs.readdirSync(testResultsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  const hits: string[] = [];
  for (const dir of dirs) {
    const dirName = dir.name.toLowerCase();
    if (!dirName.includes(needle)) continue;
    const abs = path.join(testResultsDir, dir.name);
    const files = fs.readdirSync(abs);
    for (const file of files) {
      if (fileNameRegex.test(file)) hits.push(path.join(abs, file));
    }
  }
  return hits;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeStatus(status?: string): TestArtifact["status"] {
  if (status === "passed" || status === "failed" || status === "timedOut" || status === "skipped" || status === "interrupted") {
    return status;
  }
  return "unknown";
}

function createRunId() {
  return `run_${Date.now()}`;
}

export function readRunArtifactsFromDisk(): RunArtifacts {
  const root = process.cwd();
  const lastRunPath = path.join(root, "test-results", ".last-run.json");
  const testResultsDir = path.join(root, "test-results");

  const report = safeReadJson(LATEST_JSON_PATH) as { suites?: JsonReporterNode[] } | null;
  const lastRun = safeReadJson(lastRunPath) as { status?: "passed" | "failed" } | null;

  const specs = flattenSpecs(report?.suites);

  const tests: TestArtifact[] = specs.map(({ spec, file }, idx) => {
    const name = spec.title ?? `Spec ${idx + 1}`;
    const result = spec.tests?.[0]?.results?.at(-1);
    const status = normalizeStatus(result?.status);
    const fileStem = path.basename(file || `spec-${idx + 1}`, path.extname(file || ""));
    const slug = slugify(name);
    const needle = `${fileStem}-${slug}`;

    const screenshotPaths = collectMediaPaths(testResultsDir, needle, /test-failed-\d+\.png$/i);
    const videoPaths = collectMediaPaths(testResultsDir, needle, /video\.webm$/i);

    const msg = result?.error?.message;
    const assertionHint = msg?.match(/assertion[^\n]*/i)?.[0];

    return {
      id: `${fileStem}-${slug}`,
      name,
      file: file || "unknown",
      status,
      durationMs: result?.duration ?? 0,
      screenshotPaths,
      videoPaths,
      errorSnippet: msg ? msg.slice(0, 260) : undefined,
      assertionHint: assertionHint || undefined
    };
  });

  const passed = tests.filter((t) => t.status === "passed").length;
  const failed = tests.filter((t) => t.status === "failed").length;
  const timedOut = tests.filter((t) => t.status === "timedOut").length;

  return {
    runId: createRunId(),
    generatedAt: new Date().toISOString(),
    status: lastRun?.status ?? (failed > 0 || timedOut > 0 ? "failed" : tests.length > 0 ? "passed" : "unknown"),
    total: tests.length,
    passed,
    failed,
    timedOut,
    tests
  };
}

export function ingestLatestRunArtifacts() {
  const latest = readRunArtifactsFromDisk();
  const history = readRunHistory();
  const isDuplicate = history.runs[0]?.tests.length === latest.tests.length
    && history.runs[0]?.status === latest.status
    && history.runs[0]?.tests.every((test, idx) => test.name === latest.tests[idx]?.name && test.status === latest.tests[idx]?.status);

  if (!isDuplicate && latest.total > 0) {
    history.runs.unshift(latest);
    history.runs = history.runs.slice(0, 50);
    writeJson(HISTORY_PATH, history);
  }
  return latest;
}

export function readRunHistory(): RunHistory {
  const raw = safeReadJson(HISTORY_PATH) as RunHistory | null;
  if (!raw || !Array.isArray(raw.runs)) return { runs: [] };
  return raw;
}

export function readRunArtifacts(): RunArtifacts {
  const history = readRunHistory();
  if (history.runs.length > 0) return history.runs[0];
  return readRunArtifactsFromDisk();
}

export function buildHeatmapFromHistory(): HeatmapPoint[] {
  const history = readRunHistory();
  const map = new Map<string, HeatmapPoint>();

  const catalog: Array<{ match: RegExp; breakMode: string; impactedSurface: string }> = [
    { match: /cta|start free trial|hide cta/i, breakMode: "Hide CTA Button", impactedSurface: "Conversion Section" },
    { match: /pricing|missing pricing/i, breakMode: "Missing Pricing Section", impactedSurface: "Pricing Block" },
    { match: /generate button|remove generate/i, breakMode: "Remove Generate Button", impactedSurface: "Primary Action" },
    { match: /timeout|infinite loader|delay/i, breakMode: "Delay/Infinite Loader", impactedSurface: "Inference Lifecycle" },
    { match: /navigation|dashboard|testing page/i, breakMode: "Wrong Navigation", impactedSurface: "Routing Flow" }
  ];

  for (const run of history.runs) {
    for (const test of run.tests) {
      if (test.status === "passed") continue;
      const haystack = `${test.name} ${test.errorSnippet ?? ""} ${test.assertionHint ?? ""}`;
      const matched = catalog.find((c) => c.match.test(haystack));
      const key = `${matched?.breakMode ?? "Unknown"}::${matched?.impactedSurface ?? "General"}`;
      const point = map.get(key) ?? {
        breakMode: matched?.breakMode ?? "Unknown",
        impactedSurface: matched?.impactedSurface ?? "General",
        failures: 0
      };
      point.failures += 1;
      map.set(key, point);
    }
  }

  return Array.from(map.values()).sort((a, b) => b.failures - a.failures);
}

export function buildObservabilityTimeline(run?: RunArtifacts): ObservabilityEvent[] {
  const target = run ?? readRunArtifacts();
  const events: ObservabilityEvent[] = [
    {
      time: target.generatedAt,
      level: "warn",
      kind: "chaos_toggle",
      message: "Chaos preset toggled for regression pressure.",
      confidence: 31
    }
  ];

  for (const t of target.tests) {
    events.push({
      time: target.generatedAt,
      level: "info",
      kind: "step_start",
      message: `Started test: ${t.name}`,
      confidence: 82
    });
    events.push({
      time: target.generatedAt,
      level: t.status === "passed" ? "info" : "error",
      kind: "assertion",
      message: `Assertion verdict: ${t.status} (${t.name})`,
      confidence: t.status === "passed" ? 90 : 41
    });
    if (t.screenshotPaths.length > 0) {
      events.push({
        time: target.generatedAt,
        level: "warn",
        kind: "artifact",
        message: `Screenshot captured: ${path.basename(t.screenshotPaths[0])}`,
        confidence: 88
      });
    }
    events.push({
      time: target.generatedAt,
      level: "info",
      kind: "step_end",
      message: `Completed test in ${(t.durationMs / 1000).toFixed(2)}s`,
      confidence: 87
    });
  }

  return events;
}

export function resolveArtifactFile(requestedPath: string): string | null {
  const root = process.cwd();
  const normalized = path.normalize(requestedPath);
  const abs = path.isAbsolute(normalized) ? normalized : path.join(root, normalized);
  const allowedRoot = path.join(root, "test-results");
  if (!abs.startsWith(allowedRoot)) return null;
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return null;
  return abs;
}
