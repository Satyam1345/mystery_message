import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request as any, secret: process.env.NEXT_AUTH_SECRET });
    const url = request.nextUrl;

    console.log("Secret:", process.env.NEXT_AUTH_SECRET);
    console.log("Token:", token);
    console.log("Pathname:", url.pathname);
    console.log("URL:", url);

    // If token exists and user is accessing auth-related pages, redirect to dashboard
    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
         url.pathname.startsWith('/sign-up') ||
         url.pathname.startsWith('/verify'))
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If no token, redirect to the home page
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

// Configuration for paths where middleware should be applied
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/verify/:path*',
        '/dashboard/:path*'
    ]
};