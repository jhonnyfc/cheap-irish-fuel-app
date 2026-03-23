import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session_token");
  const { pathname } = request.nextUrl;

  if (
    (pathname.startsWith("/profile") ||
      pathname.startsWith("/favorites") ||
      (pathname.startsWith("/station/") && pathname.endsWith("/edit"))) &&
    !session
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    (pathname.startsWith("/login") || pathname.startsWith("/register")) &&
    session
  ) {
    return NextResponse.redirect(new URL("/", request.url)); // usually /profile or /
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/login",
    "/register",
    "/favorites/:path*",
    "/station/:path*/edit",
  ],
};
