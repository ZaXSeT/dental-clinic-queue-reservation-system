import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Require patient_token for booking page
    const patientToken = request.cookies.get('patient_token')?.value;

    if (pathname.startsWith('/booking')) {
        if (!patientToken) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
