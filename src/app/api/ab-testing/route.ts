import { Effect } from "effect";
import { NextRequest, NextResponse } from "next/server";
import { getSegments } from "../../../lib/queries/segments";

export const dynamic = 'force-static';
export const revalidate = 60 * 60;

export async function GET(request: NextRequest) {
    const res = await Effect.runPromise(getSegments);
    return NextResponse.json(res);
}