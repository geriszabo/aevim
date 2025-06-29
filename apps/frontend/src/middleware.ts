import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/signup', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('authToken')?.value;

  // Check if current path is public (auth pages)
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!isPublicRoute && !authToken) {
    // Add a debug header so you can see middleware is working
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set('x-middleware-redirect', 'no-auth');
    return response;
  }

  // If accessing auth pages (login/signup) while authenticated
  if (isPublicRoute && authToken && (pathname === '/login' || pathname === '/signup')) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.headers.set('x-middleware-redirect', 'already-auth');
    return response;
  }

  // Add debug header to see middleware is running
  const response = NextResponse.next();
  response.headers.set('x-middleware-executed', 'true');
  response.headers.set('x-auth-token-present', authToken ? 'true' : 'false');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (API routes handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};