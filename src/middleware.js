import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { verifyToken } from "./lib/jwt";

export async function middleware(request) {
  // Get NextAuth token for web routes
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Get custom JWT token from Authorization header or cookies for API routes
  const bearerToken = request.headers.get("authorization")?.replace("Bearer ", "").trim();
  const cookieToken = request.cookies.get("token")?.value;
  const customToken = bearerToken || cookieToken;

  if (request.nextUrl.pathname.startsWith("/api/protected")) {
    let validToken = null;

    // First try custom JWT token (for API clients like Postman)
    if (customToken) {
      const decoded = await verifyToken(customToken);
      if (decoded) {
        validToken = decoded;
      }
    }

    // If no custom token or invalid, try NextAuth token (for web app)
    if (!validToken && nextAuthToken) {
      validToken = nextAuthToken;
    }

    // If no valid token found, deny access
    if (!validToken) {
      return NextResponse.json({ error: "Access denied - No token provided" }, { status: 401 });
    }

    // Add the token info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user", JSON.stringify(validToken));
    requestHeaders.set("x-user-id", validToken.id || validToken.sub);
    requestHeaders.set("x-user-role", validToken.role);
    requestHeaders.set("x-user-email", validToken.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!nextAuthToken) {
      return NextResponse.redirect(new URL("/auth?tab=login", request.url));
    }
  }

  // Handle /dashboard/user routes specifically
  if (request.nextUrl.pathname.startsWith("/dashboard/user")) {
    if (!nextAuthToken) {
      return NextResponse.redirect(new URL("/auth?tab=login", request.url));
    }

    // Redirect based on role
    if (["admin", "editor"].includes(nextAuthToken.role)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Users stay on /dashboard/user (no redirect needed)
  }

  // Handle admin routes (web routes - use NextAuth)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!nextAuthToken) {
      return NextResponse.redirect(new URL("/auth?tab=login", request.url));
    }

    // Check if user has admin or editor role
    if (!["admin", "editor"].includes(nextAuthToken.role)) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    // Admin-only routes
    if (
      (request.nextUrl.pathname.startsWith("/admin/users") ||
        request.nextUrl.pathname.startsWith("/admin/advertisement")) &&
      nextAuthToken.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
  }

  // Redirect authenticated users away from auth page
  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (nextAuthToken) {
      // Redirect based on role
      if (["admin", "editor"].includes(nextAuthToken.role)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/protected/:path*", "/dashboard/:path*", "/admin/:path*", "/auth/:path*"],
};
