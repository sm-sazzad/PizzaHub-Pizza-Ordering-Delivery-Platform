import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Check session on the server
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Not logged in -> redirect to Sign In
  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2. Blocked account -> redirect to Blocked page
  const isBlocked = Boolean(
    (session.user as { isBlocked?: boolean })?.isBlocked
  );
  if (isBlocked) {
    return NextResponse.redirect(new URL("/blocked", request.url));
  }

  // 3. Server-side role verification for dashboard routes
  const role = session.user.role;

  // Admin routes: only admin can enter
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Vendor routes: only vendor can enter
  const isVendorRoute =
    pathname.startsWith("/dashboard/add-item") ||
    pathname.startsWith("/dashboard/menu") ||
    pathname.startsWith("/dashboard/vendor-orders") ||
    pathname.startsWith("/dashboard/subscription");

  if (isVendorRoute && role !== "vendor") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Customer routes: only customer can enter
  if (pathname.startsWith("/dashboard/my-orders") && role !== "customer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Matches all protected routes
};
