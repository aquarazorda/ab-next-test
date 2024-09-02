import { NextRequest, NextResponse } from "next/server";

export type AbTestingRoutes = {
    [key: string]: string[];
};

// revalidate every hour
export const dynamic = 'force-static';
export const revalidate = 60 * 60;

export async function GET(request: NextRequest) {
    return NextResponse.json({
        "vip": ["/home-vip"]
    });
}