import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const { pathname } = url;
    const hostname = request.headers.get('host') || '';
    const token = request.cookies.get('admin_token');

    const isAdminSubdomain = hostname.startsWith('admin.');
    const isAdminPath = pathname.startsWith('/admin');

    if (isAdminSubdomain) {
        const isLoginPage = pathname === '/admin/login' || pathname === '/login';

        if (!token && !isLoginPage) {
            const redirectUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(redirectUrl);
        }

        if (pathname === '/' || pathname === '/dashboard') {
            url.pathname = '/admin/portal/dashboard';
            return NextResponse.rewrite(url);
        }

        if (pathname === '/login') {
            url.pathname = '/admin/login';
            return NextResponse.rewrite(url);
        }

        const adminPortalPaths = ['/dashboard', '/queue', '/Messages', '/appointments', '/patients', '/doctors', '/billing', '/settings'];
        const matchedPortalPath = adminPortalPaths.find(p => pathname === p || pathname.startsWith(p + '/'));
        if (matchedPortalPath) {
            url.pathname = `/admin/portal${pathname}`;
            return NextResponse.rewrite(url);
        }

        if (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
            url.pathname = `/admin${pathname}`;
            return NextResponse.rewrite(url);
        }
    }

    if (isAdminPath) {
        const isLoginPage = pathname === '/admin/login';

        if (!token && !isLoginPage) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        if (pathname === '/admin' || pathname === '/admin/') {
            return NextResponse.redirect(new URL('/admin/portal/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
