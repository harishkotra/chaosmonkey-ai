import { NextResponse } from "next/server";
import { buildHeatmapFromHistory } from "@/lib/server/artifacts";

export async function GET() {
  return NextResponse.json({ points: buildHeatmapFromHistory() });
}
