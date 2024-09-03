import { getUser } from '@/utils/user';
import { Effect } from 'effect';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { match, P } from 'ts-pattern';
import { getSegments } from './lib/queries/segments';

const findMatchingRoute = (routes: string[], path: string) =>
    routes.find(route => path === '/' ? route.startsWith('/home-') : path.startsWith(route));

export async function middleware(request: NextRequest) {
    const user = getUser();
    const path = request.nextUrl.pathname;

    const segments = await Effect.runPromise(getSegments);

    if (!segments || segments.length === 0) return NextResponse.next();

    return match({ user, path })
        .with({ user: { segment: P.string } }, ({ user, path }) => {
            const segmentRoutes = segments.find(segment => segment.name === user.segment)?.routes;
            if (!segmentRoutes) return NextResponse.next();

            const matchingRoute = findMatchingRoute(segmentRoutes, path);
            return matchingRoute
                ? NextResponse.rewrite(new URL(matchingRoute, request.url))
                : NextResponse.next();
        })
        .otherwise(() => NextResponse.next());
}

// Optionally, you can specify which routes the middleware should run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|cms).*)'],
};