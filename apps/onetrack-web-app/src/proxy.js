// middleware.ts
import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname === "/" || pathname === "/signin" || pathname === "/signup") {
    if (session) {
      return NextResponse.redirect(
        new URL("/dashboard/applications", request.url)
      );
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
