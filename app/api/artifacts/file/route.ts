import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { resolveArtifactFile } from "@/lib/server/artifacts";

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("path");
  if (!file) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  const abs = resolveArtifactFile(file);
  if (!abs) return NextResponse.json({ error: "Invalid artifact path" }, { status: 404 });

  const buffer = fs.readFileSync(abs);
  const contentType = abs.endsWith(".png") ? "image/png" : abs.endsWith(".webm") ? "video/webm" : "application/octet-stream";
  return new NextResponse(buffer, { headers: { "Content-Type": contentType } });
}
