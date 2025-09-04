import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff|woff2|ttf|eot)$/)) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === "/metodologi") {
    return NextResponse.next();
  }

  if (pathname === '/ai-overview/profile' && searchParams.has('access_token')) {
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