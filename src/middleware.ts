import { Effect } from "effect";
import { NextRequest, NextResponse } from "next/server";
import { segmentSchema } from "./lib/schemas/segments";
import { userSchema } from "./lib/schemas/user";
import { env } from "./utils/env";

const findMatchingRoute = (
  routes: string[],
  path: string,
  segments: string[],
) =>
  routes.find((route) =>
    path === "/"
      ? segments.some((segment) => route.startsWith(`home-${segment}`))
      : segments.some(() => path.startsWith(route)),
  );

export async function middleware(request: NextRequest) {
  return Effect.gen(function* () {
    const userCookie = request.cookies.get("user");
    if (!userCookie) return yield* Effect.fail(new Error("Not logged in"));

    const users = yield* Effect.tryPromise(() =>
      fetch(env.NEXT_PUBLIC_BASE_URL + "/api/users", {
        next: {
          revalidate: 60 * 60 * 1, // 1 hour
        },
      })
        .then((res) => res.json())
        .then((data) => userSchema.array().parseAsync(data)),
    );

    const user = users.find((user) => user.name === userCookie.value);
    if (!user) return yield* Effect.fail(new Error("User not found"));

    const segments = yield* Effect.tryPromise(() =>
      fetch(env.NEXT_PUBLIC_BASE_URL + "/api/segments", {
        next: {
          revalidate: 60 * 60 * 1, // 1 hour
        },
      })
        .then((res) => res.json())
        .then((data) => segmentSchema.array().parseAsync(data)),
    );

    if (!segments || segments.length === 0)
      return yield* Effect.fail(new Error("No segments found"));

    const userSegments = user.segments;
    const relevantSegments = segments.filter((segment) =>
      userSegments.includes(segment.name),
    );

    if (relevantSegments.length === 0)
      return yield* Effect.fail(new Error("No relevant segments found"));

    const allRelevantRoutes = relevantSegments.flatMap(
      (segment) => segment.routes,
    );
    const matchingRoute = findMatchingRoute(
      allRelevantRoutes,
      request.nextUrl.pathname,
      userSegments,
    );
    if (!matchingRoute)
      return yield* Effect.fail(new Error("No matching route found"));

    return yield* Effect.succeed(
      NextResponse.rewrite(new URL(matchingRoute, request.url)),
    );
  }).pipe(
    Effect.tapError(Effect.logError),
    Effect.catchAll((e) => {
      return Effect.succeed(NextResponse.next());
    }),
    Effect.runPromise,
  );
}

// Optionally, you can specify which routes the middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|cms).*)"],
};
