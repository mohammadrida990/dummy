import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const protectedPaths = ["/"];

  const isProtected = protectedPaths.some(
    (path) => req.nextUrl.pathname === path
  );
  console.log(isProtected && !token);

  if (isProtected && !token) {
    const signInUrl = new URL("/auth/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Add more protected paths here
};
