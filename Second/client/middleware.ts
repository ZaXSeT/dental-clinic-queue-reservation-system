import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const { pathname } = url;
    const hostname = request.headers.get('host') || '';
    const token = request.cookies.get('staff_auth_token')?.value;

    const isStaffSubdomain = hostname.startsWith('staff.');
    const isStaffPath = pathname.startsWith('/staff');

    if (isStaffSubdomain) {
        const isLoginPage = pathname === '/staff/login' || pathname === '/staff';

        if (!token && !isLoginPage) {
            const redirectUrl = new URL('/staff/login', request.url);
            return NextResponse.redirect(redirectUrl);
        }

        if (pathname === '/' || pathname === '/queue') {
            url.pathname = '/staff/portal/queue';
            return NextResponse.rewrite(url);
        }

        // if (pathname === '/login') {
        //     url.pathname = '/staff/login';
        //     return NextResponse.rewrite(url);
        // }

        const staffPortalPaths = ['/queue', '/Messages', '/appointments', '/patients', '/doctors', '/billing', '/settings'];
        const matchedPortalPath = staffPortalPaths.find(p => pathname === p || pathname.startsWith(p + '/'));
        if (matchedPortalPath) {
            url.pathname = `/staff/portal${pathname}`;
            return NextResponse.rewrite(url);
        }

        if (!pathname.startsWith('/staff') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
            url.pathname = `/staff${pathname}`;
            return NextResponse.rewrite(url);
        }
    }

    if (isStaffPath) {
        const isLoginPage = pathname === '/staff/login';

        if (!token && !isLoginPage) {
            return NextResponse.redirect(new URL('/staff/login', request.url));
        }

        if (pathname === '/staff' || pathname === '/staff/') {
            return NextResponse.redirect(new URL('/staff/portal/queue', request.url));
        }
    }

    if (pathname === '/') {
       return NextResponse.redirect(new URL('/staff/portal/queue', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
