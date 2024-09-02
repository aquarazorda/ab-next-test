import { getUser } from '@/utils/user';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { match, P } from 'ts-pattern';
import { AbTestingRoutes } from './app/api/ab-testing/route';

const findMatchingRoute = (routes: string[], path: string) =>
    routes.find(route => path === '/' ? route.startsWith('/home-') : path.startsWith(route));

export async function middleware(request: NextRequest) {
    const user = getUser();
    const path = request.nextUrl.pathname;
    const host = request.headers.get("referer")

    const abTestingRoutes = await fetch(host + '/api/ab-testing').then(res => res.json() as Promise<AbTestingRoutes>);

    return match({ user, path })
        .with({ user: { segment: P.string } }, ({ user, path }) => {
            const segmentRoutes = abTestingRoutes[user.segment];
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
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};