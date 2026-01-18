import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Define allowed domains (localhost and your production domain)
    // Adjust 'localhost:3000' based on your actual port if different
    const currentHost = hostname.replace(`.localhost:3000`, '').replace(`.yourdomain.com`, '');

    // Check if we are on the 'admin' subdomain
    // Example: admin.localhost:3000 or admin.dentalclinic.com
    if (hostname.startsWith('admin.')) {
        // If user is accessing root (admin.com/), rewrite to /admin/dashboard or just /admin
        if (url.pathname === '/') {
            url.pathname = '/admin';
        }

        // Rewrite all requests from admin subdomain to the /admin route handles
        // But we need to be careful not to double-nest (e.g. /admin/admin/...)
        // Since our file structure IS /app/admin, we might not need to rewrite path prefix if we are already there,
        // BUT usually subdomain routing maps `admin.com/dashboard` -> `/admin/dashboard` internally.

        // Let's keep it simple: Just allow access. 
        // Actually, purely separate subdomain routing typically requires moving `app/admin` to `app/[domain]/...` logic 
        // OR just rewriting URL.

        // Scenario: User visits admin.localhost:3000/dashboard
        // Internal Next.js should handle this as if visiting localhost:3000/admin/dashboard

        if (!url.pathname.startsWith('/admin')) {
            url.pathname = `/admin${url.pathname}`;
            return NextResponse.rewrite(url);
        }
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
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
