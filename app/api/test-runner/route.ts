import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    run: {
      pass: 6,
      fail: 2,
      runtimeMs: 4860,
      screenshots: ["run_73_step_2.png", "run_73_step_4.png"]
    }
  });
}
