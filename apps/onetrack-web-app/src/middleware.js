// middleware.ts
import { auth } from "../auth";
import { NextResponse } from "next/server";


const protectedRoutes = ["/dashboard", "/settings", "/profile"];

export async function middleware(request) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    const signInUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from /signin
  if (pathname === "/signin" && session) {
    return NextResponse.redirect(new URL("/dashboard/applications", request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/settings/:path*", "/profile/:path*", "/signin"],
  };