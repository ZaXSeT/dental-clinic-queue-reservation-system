import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const { pathname } = url;
    
    // Admin backend is handled by Second project, but just in case
    if (pathname.startsWith('/admin') || pathname.startsWith('/staff')) {
        return NextResponse.next(); 
    }

    // Require patient_token for booking page
    const patientToken = request.cookies.get('patient_token')?.value;

    if (pathname.startsWith('/booking')) {
        if (!patientToken) {
            return NextResponse.redirect(new URL('/login?callbackUrl=/booking', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
