import { auth } from "@/auth";

import { NextResponse, type NextRequest } from "next/server";

export default auth(async function middleware(request) {
  const { nextUrl } = request;
  const session = request.auth; // Auth.js provides the session here when wrapped

  // 1. Handle Ryen redirect (Public access)
  if (nextUrl.pathname === "/ryen-hybrid-rockstar") {
    const redirectUrl = process.env.NEXT_PUBLIC_RYEN_HYROX_REDIRECT_URL;
    if (redirectUrl?.trim()) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // 2. Handle admin auth
  // Logic: If path starts with /admin/ and NO session exists, redirect to /admin
  const isAdminPath = nextUrl.pathname.startsWith("/admin/");
  const isLoginPage = nextUrl.pathname === "/admin";

  if (isAdminPath && !isLoginPage && !session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
});

export const config = {
  // Combine both matchers here
  matcher: ["/admin/:path*", "/ryen-hybrid-rockstar"],
};
