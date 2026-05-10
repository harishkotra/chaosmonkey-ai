export type ArtifactTestStatus = "passed" | "failed" | "timedOut" | "skipped" | "interrupted" | "unknown";

export type TestArtifact = {
  id: string;
  name: string;
  file: string;
  status: ArtifactTestStatus;
  durationMs: number;
  screenshotPaths: string[];
  videoPaths: string[];
  errorSnippet?: string;
  assertionHint?: string;
};

export type RunArtifacts = {
  runId?: string;
  generatedAt: string;
  status: "passed" | "failed" | "unknown";
  total: number;
  passed: number;
  failed: number;
  timedOut: number;
  tests: TestArtifact[];
};

export type ObservabilityEvent = {
  time: string;
  level: "info" | "warn" | "error";
  kind: "chaos_toggle" | "step_start" | "step_end" | "assertion" | "artifact";
  message: string;
  confidence?: number;
};

export type HeatmapPoint = {
  breakMode: string;
  impactedSurface: string;
  failures: number;
};

export type RunHistory = {
  runs: RunArtifacts[];
};
