import { NextResponse } from "next/server";
import { ingestLatestRunArtifacts, readRunHistory } from "@/lib/server/artifacts";

export async function GET() {
  ingestLatestRunArtifacts();
  return NextResponse.json(readRunHistory());
}
