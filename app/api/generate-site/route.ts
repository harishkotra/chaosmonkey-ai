import { NextRequest, NextResponse } from "next/server";
import { generateJson } from "@/lib/server/llm";

type Body = {
  idea: string;
  style: string;
  breakModes: Record<string, boolean>;
};

type Output = {
  title: string;
  sections: string[];
  cta: string;
  confidence: number;
  note?: string;
};

function fallback(body: Body): Output {
  const sections = ["Hero", "Testimonials", "Feature Grid", "Pricing", "Footer"];
  if (body.breakModes.missingPricing) {
    return {
      title: body.breakModes.hallucination ? "Quantum Unicorn Banking Cloud" : body.idea,
      sections: sections.filter((s) => s !== "Pricing"),
      cta: body.breakModes.hideCTA ? "" : "Start Free Trial",
      confidence: 56,
      note: body.breakModes.hallucination ? "Hallucinated claim injected." : "Generated with fallback content."
    };
  }
  return {
    title: body.breakModes.hallucination ? "Quantum Unicorn Banking Cloud" : body.idea,
    sections,
    cta: body.breakModes.hideCTA ? "" : "Start Free Trial",
    confidence: body.breakModes.delayResponse ? 74 : 89,
    note: "Generated with fallback content."
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Body;

  if (body.breakModes.emptyResponse) {
    return NextResponse.json({
      title: "",
      sections: [],
      cta: "",
      confidence: 42,
      note: "Empty response mode active."
    } satisfies Output);
  }

  const prompt = `Generate JSON for an AI landing page draft.\nidea=${body.idea}\nstyle=${body.style}\nbreakModes=${JSON.stringify(body.breakModes)}\nReturn JSON exactly in shape: {"title":string,"sections":string[],"cta":string,"confidence":number,"note":string}.\nRules: If hallucination true include unrealistic claim in note. If missingPricing true omit Pricing section. If hideCTA true set cta empty. Keep sections <= 6.`;

  const data = await generateJson<Output>(prompt, fallback(body));
  return NextResponse.json(data);
}
