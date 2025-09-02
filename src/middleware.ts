import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip middleware for static files
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff|woff2|ttf|eot)$/)) {
    return NextResponse.next();
  }

  // Allow public routes
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // Allow access to profile page ONLY during OAuth redirect (with access_token)
  if (pathname === '/ai-overview/profile' && searchParams.has('access_token')) {
    return NextResponse.next();
  }

  // Check for auth cookie
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