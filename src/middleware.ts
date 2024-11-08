import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import  authOptions  from "next-auth";
export {default} from "next-auth/middleware"
export async function middleware(request: NextRequest){

    const token = await getToken({req:request , secret:process.env.NEXT_AUTH_SECRET})
    const url = request.nextUrl
    console.log(process.env.NEXT_AUTH_SECRET)
    console.log("Token:", token);
    console.log("Pathname:", url.pathname);
    console.log("URL:", url);

    if(token && 
        (url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/')

    )
    ){
        return NextResponse.redirect(new URL ('/dashboard' , request.url))
    }

    return NextResponse.redirect(new URL('/home' , request.url))
}

// to assign paths where we wish to use middleware, it wont run at other paths
export const config = {
    matcher : [
        // '/sign-in',
        // '/sign-up',
        // '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ] ,
}