import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;


  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff|woff2|ttf|eot)$/)) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === "/metodologi" || pathname === "/kebijakan-privasi") {
    return NextResponse.next();
  }

  if (pathname === '/ai-overview/profile' && searchParams.has('access_token')) {
    return NextResponse.next();
  }

  // Allow access to ai-overview with order_id parameters (payment redirect)
  // This allows users to access analysis results after successful payment
  // without requiring authentication cookie to be present
  if (pathname === '/ai-overview' &&
      (searchParams.has('order_id') || searchParams.has('status_code') || searchParams.has('transaction_status'))) {
    return NextResponse.next();
  }

  // Redirect OAuth users from /ai-overview to /ai-overview/profile
  // This handles the case where backend OAuth redirects to /ai-overview but we want /ai-overview/profile
  if (pathname === '/ai-overview' && searchParams.has('access_token')) {
    const newUrl = new URL('/ai-overview/profile', request.url);
    // Copy all search parameters including access_token
    searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(newUrl);
  }

  // Allow access to PDF and story generation routes when print=true or when token is provided
  if ((pathname === '/ai-overview/pdf' || pathname === '/ai-overview/story') &&
      (searchParams.get('print') === 'true' || searchParams.has('token'))) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get('auth');

  // If no auth cookie, redirect to a cleanup route that will handle localStorage clearing
  if (!authCookie) {
    // For API routes and static files, don't redirect
    if (pathname.startsWith('/api/') || pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff|woff2|ttf|eot)$/)) {
      return NextResponse.next();
    }

    // For login and register pages, allow access
    if (pathname === '/login' || pathname === '/register' || pathname === '/') {
      return NextResponse.next();
    }

    // For all other protected routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Additional session validation could be added here in the future
  // For example: JWT token validation, session expiry checks, etc.
  // For now, we trust the cookie presence and let the frontend handle detailed auth

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * Static files are handled by skipping them in the middleware function
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};