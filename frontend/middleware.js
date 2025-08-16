import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // protect these routes
  const needsAuth =
    pathname.startsWith("/home") ||
    pathname.startsWith("/pinned") ||
    pathname.startsWith("/trash");

  if (!needsAuth) return NextResponse.next();

  // must match your FastAPI cookie name
  const token = req.cookies.get("token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", pathname); // remember where user wanted to go
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/pinned/:path*", "/trash/:path*"],
};