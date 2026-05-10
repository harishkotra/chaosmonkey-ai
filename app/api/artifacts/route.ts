import { NextResponse } from "next/server";
import { ingestLatestRunArtifacts, readRunArtifacts } from "@/lib/server/artifacts";

export async function GET() {
  ingestLatestRunArtifacts();
  return NextResponse.json(readRunArtifacts());
}
