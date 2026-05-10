import type { FullConfig } from "@playwright/test";
import { ingestLatestRunArtifacts } from "../lib/server/artifacts";

async function globalTeardown(_config: FullConfig) {
  try {
    ingestLatestRunArtifacts();
  } catch {
    // Do not fail test run on telemetry/artifact ingestion errors.
  }
}

export default globalTeardown;
