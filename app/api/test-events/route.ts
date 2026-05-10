import { NextRequest, NextResponse } from "next/server";
import { publishEvent } from "@/lib/server/test-events";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { type: "log" | "status" | "assertion" | "artifact"; message: string };
  publishEvent({ type: body.type, message: body.message });
  return NextResponse.json({ ok: true });
}
