export type AIStrategy = "fast" | "balanced" | "deep";

export const AI_STRATEGY_LABELS: Record<AIStrategy, string> = {
  fast: "Fast / Cheap",
  balanced: "Balanced",
  deep: "Deep"
};

export const PASSMARK_STRATEGY_CONFIG = {
  fast: {
    ai: {
      models: {
        stepExecution: "google/gemini-3-flash",
        utility: "google/gemini-2.5-flash"
      }
    }
  },
  balanced: {
    ai: {
      models: {
        stepExecution: "google/gemini-3-flash-preview",
        utility: "google/gemini-2.5-flash"
      }
    }
  },
  deep: {
    ai: {
      models: {
        stepExecution: "google/gemini-3.1-pro-preview",
        utility: "google/gemini-3.1-pro-preview"
      }
    }
  }
} as const;
