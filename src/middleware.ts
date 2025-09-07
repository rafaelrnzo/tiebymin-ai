import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Debug logging for ai-overview requests
  if (pathname.startsWith('/ai-overview')) {
    console.log('Middleware - AI Overview Request:', {
      pathname,
      hasOrderId: searchParams.has('order_id'),
      hasStatusCode: searchParams.has('status_code'),
      hasTransactionStatus: searchParams.has('transaction_status'),
      hasResultId: searchParams.has('result_id'),
      hasAccessToken: searchParams.has('access_token'),
      hasAuthCookie: !!request.cookies.get('auth')
    });
  }

  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff|woff2|ttf|eot)$/)) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === "/metodologi") {
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
    console.log('Middleware - Allowing access to ai-overview with order parameters');
    return NextResponse.next();
  }

  // Allow access to PDF and story generation routes when print=true or when token is provided
  if ((pathname === '/ai-overview/pdf' || pathname === '/ai-overview/story') &&
      (searchParams.get('print') === 'true' || searchParams.has('token'))) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get('auth');
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

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