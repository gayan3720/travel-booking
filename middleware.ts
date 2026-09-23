import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Example: restrict staff from a "settings" area reserved for owner
    if (path.startsWith("/admin/settings") && token?.role !== "owner") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only allow through if a valid session token exists
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

// Protect everything under /admin except the login page itself
export const config = {
  matcher: ["/admin/((?!login).*)"],
};
