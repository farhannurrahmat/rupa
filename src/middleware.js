import { NextResponse } from "next/server";

// Gerbang pertama: hanya mengecek ada tidaknya cookie sesi.
// Pengecekan peran yang sebenarnya dilakukan di server (requireRole).
export function middleware(request) {
  const hasSession = request.cookies.has("rupa_session");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// Hanya berjalan untuk route yang private
export const config = {
  matcher: ["/member/:path*", "/curator/:path*", "/admin/:path*"],
};