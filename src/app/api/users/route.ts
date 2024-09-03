import { Effect } from "effect";
import { NextResponse } from "next/server";
import { getUsers } from "../../../lib/queries/users";

export async function GET() {
  const users = await getUsers.pipe(Effect.runPromise);
  return NextResponse.json(users);
}
