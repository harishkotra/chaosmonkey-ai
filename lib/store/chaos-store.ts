"use client";

import { create } from "zustand";
import { AIStrategy } from "@/lib/data/ai-strategies";

export type BreakModeKey =
  | "removeGenerate"
  | "delayResponse"
  | "wrongNavigation"
  | "brokenValidation"
  | "hideCTA"
  | "emptyResponse"
  | "hallucination"
  | "infiniteLoader"
  | "brokenMobile"
  | "missingPricing";

export type BreakMode = {
  key: BreakModeKey;
  label: string;
  description: string;
};

export const BREAK_MODES: BreakMode[] = [
  { key: "removeGenerate", label: "Remove Generate Button", description: "Primary action disappears." },
  { key: "delayResponse", label: "Delay AI Response", description: "Inference spikes to 12s." },
  { key: "wrongNavigation", label: "Wrong Navigation", description: "Flow lands on wrong tab." },
  { key: "brokenValidation", label: "Broken Form Validation", description: "Required fields ignored." },
  { key: "hideCTA", label: "Hide CTA Button", description: "Final call-to-action is missing." },
  { key: "emptyResponse", label: "Empty AI Response", description: "Generation returns blank result." },
  { key: "hallucination", label: "Hallucinated Output", description: "Output invents impossible features." },
  { key: "infiniteLoader", label: "Infinite Loader", description: "Loading state never resolves." },
  { key: "brokenMobile", label: "Broken Mobile Layout", description: "Viewport collapses layout." },
  { key: "missingPricing", label: "Missing Pricing Section", description: "Pricing module not rendered." }
];

type ChaosState = {
  enabled: Record<BreakModeKey, boolean>;
  confidenceScore: number;
  lastRunStatus: "idle" | "running" | "pass" | "fail";
  demoNarration: string;
  isDemoMode: boolean;
  aiStrategy: AIStrategy;
  toggleMode: (key: BreakModeKey) => void;
  breakEverything: () => void;
  clearBreaks: () => void;
  setLastRunStatus: (status: ChaosState["lastRunStatus"]) => void;
  startDemoMode: () => void;
  setDemoNarration: (line: string) => void;
  endDemoMode: () => void;
  setAIStrategy: (strategy: AIStrategy) => void;
};

const baseEnabled = BREAK_MODES.reduce(
  (acc, item) => ({ ...acc, [item.key]: false }),
  {} as Record<BreakModeKey, boolean>
);

export const useChaosStore = create<ChaosState>((set) => ({
  enabled: baseEnabled,
  confidenceScore: 92,
  lastRunStatus: "idle",
  demoNarration: "Demo mode standby.",
  isDemoMode: false,
  aiStrategy: "balanced",
  toggleMode: (key) =>
    set((state) => {
      const nextEnabled = { ...state.enabled, [key]: !state.enabled[key] };
      const active = Object.values(nextEnabled).filter(Boolean).length;
      return {
        enabled: nextEnabled,
        confidenceScore: Math.max(11, 95 - active * 8)
      };
    }),
  breakEverything: () =>
    set({
      enabled: BREAK_MODES.reduce((acc, item) => ({ ...acc, [item.key]: true }), {} as Record<BreakModeKey, boolean>),
      confidenceScore: 7
    }),
  clearBreaks: () => set({ enabled: baseEnabled, confidenceScore: 93 }),
  setLastRunStatus: (status) => set({ lastRunStatus: status }),
  startDemoMode: () =>
    set({
      isDemoMode: true,
      demoNarration: "Injecting cinematic chaos preset...",
      enabled: {
        ...baseEnabled,
        removeGenerate: true,
        hideCTA: true,
        missingPricing: true,
        delayResponse: true
      },
      confidenceScore: 24
    }),
  setDemoNarration: (line) => set({ demoNarration: line }),
  endDemoMode: () => set({ isDemoMode: false, demoNarration: "Demo mode complete." }),
  setAIStrategy: (strategy) => set({ aiStrategy: strategy })
}));
