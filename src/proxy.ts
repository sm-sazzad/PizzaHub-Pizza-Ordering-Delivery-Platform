import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // Pass incoming request.headers directly to Better-Auth getSession
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // 1. If not logged in, redirect to normal sign-in
  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2. If logged in but account is blocked, redirect directly to /blocked page
  const isBlocked = Boolean(
    (session.user as { isBlocked?: boolean })?.isBlocked
  );

  if (isBlocked) {
    return NextResponse.redirect(new URL("/blocked", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protects /dashboard and all child routes
};
