// middleware.ts
import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const session = await auth();

  if (request.nextUrl.pathname === "/") {
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
  matcher: ["/", "/dashboard/:path*", "/settings/:path*", "/profile/:path*"],
};
