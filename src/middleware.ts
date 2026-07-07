import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

    // If logged in and trying to access login/register, redirect to dashboard
    if (isAuthPage) {
      if (isAuth) {
        if (token.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', req.url));
        }
        return NextResponse.redirect(new URL('/candidate', req.url));
      }
      return null;
    }

    // If not logged in, force them to login page
    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
    }

    // Role-based protection: Prevent candidates from accessing admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/candidate', req.url));
    }
    
    // Role-based protection: Prevent admins from getting stuck in candidate routes
    if (req.nextUrl.pathname.startsWith('/candidate') && token.role !== 'CANDIDATE') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  },
  {
    callbacks: {
      // Always return true to let the middleware function above handle all the routing logic
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/candidate/:path*', '/login', '/register']
};
