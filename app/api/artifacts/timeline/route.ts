import { NextResponse } from "next/server";
import { buildObservabilityTimeline } from "@/lib/server/artifacts";

export async function GET() {
  return NextResponse.json({ events: buildObservabilityTimeline() });
}
