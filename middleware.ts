import { NextRequest, NextResponse } from "next/server";
// import { verifyIdToken } from './lib/firebase-admin'; // optional if using Admin SDK

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // List of protected routes
  const protectedPaths = ["/"];

  const isProtected = protectedPaths.some(
    (path) => req.nextUrl.pathname === path
  );

  if (isProtected && !token) {
    const signInUrl = new URL("/auth/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Add more protected paths here
};
