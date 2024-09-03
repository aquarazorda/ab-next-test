import { Effect } from "effect";
import { NextResponse } from "next/server";
import { getSegments } from "../../../lib/queries/segments";

export async function GET() {
  const segments = await getSegments.pipe(Effect.runPromise);
  return NextResponse.json(segments);
}
