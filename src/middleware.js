import { NextResponse } from "next/server";


export function middleware(request) {
  const hasSession = request.cookies.has("rupa_session");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/curator/:path*", "/admin/:path*"],
};