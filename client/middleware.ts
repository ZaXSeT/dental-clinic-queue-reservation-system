import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const { pathname } = url;
    const hostname = request.headers.get('host') || '';
    const token = request.cookies.get('admin_token');

    const isAdminSubdomain = hostname.startsWith('admin.');
    const isAdminPath = pathname.startsWith('/admin');

    if (isAdminSubdomain || isAdminPath) {
        const isLoginPage = pathname === '/login' || pathname === '/admin/login' || (isAdminSubdomain && pathname === '/login');

        if (!token && !isLoginPage) {
            const redirectUrl = isAdminSubdomain
                ? new URL('/login', request.url)
                : new URL('/admin/login', request.url);
            return NextResponse.redirect(redirectUrl);
        }

        if (isAdminSubdomain) {
            if (pathname === '/') {
                url.pathname = '/admin/dashboard';
                return NextResponse.rewrite(url);
            }

            if (!pathname.startsWith('/admin')) {
                url.pathname = `/admin${pathname}`;
                return NextResponse.rewrite(url);
            }
        }

        if (isAdminPath && pathname === '/admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
