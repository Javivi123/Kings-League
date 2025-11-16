import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    
    // Block register page completely (only admin can create accounts)
    if (pathname.startsWith("/register")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If user is logged in and tries to access login, redirect to home
    if (token && pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect admin routes - strict role check
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Protect presidente routes
    if (pathname.startsWith("/my-team") || 
        pathname.startsWith("/transfers") || 
        pathname.startsWith("/wallet") || 
        pathname.startsWith("/agenda")) {
      if (!token || token.role !== "presidente") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Protect jugador routes
    if (pathname.startsWith("/my-profile")) {
      if (!token || token.role !== "jugador") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Protect settings - requires authentication
    if (pathname.startsWith("/settings") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Public paths (no auth required)
        const publicPaths = [
          "/",
          "/login",
          "/teams",
          "/standings",
          "/players",
          "/matches",
          "/news",
        ];
        
        const isPublicPath = publicPaths.some(
          (path) => pathname === path || pathname.startsWith(path + "/")
        );

        if (isPublicPath) {
          return true;
        }

        // All other paths require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

