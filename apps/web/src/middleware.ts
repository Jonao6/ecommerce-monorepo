import { NextRequest, NextResponse } from 'next/server';
interface User {
	id: string;
	name: string;
	email: string;
}

const protectedRoutes = ['/dashboard', '/checkout', '/order', '/payment'];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);

	if (isProtectedRoute) {
		try {
			const authorizationUrl = new URL('/api/me', req.nextUrl.origin);
			const cookies = req.cookies.toString();
			const res = await fetch(authorizationUrl, {
				method: 'GET',
				headers: {
					Cookie: cookies,
				},
				cache: 'no-store',
			});
			console.log(cookies);
			if (!res.ok) {
				return NextResponse.redirect(new URL('/signin', req.nextUrl));
			}

			const contentType = res.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {
				return NextResponse.redirect(new URL('/signin', req.nextUrl));
			}

			const data: { ok: boolean; user: User } = await res.json();

			if (!data.ok) {
				return NextResponse.redirect(new URL('/signin', req.nextUrl));
			}

			const response = NextResponse.next();
			const setCookieHeaders = res.headers.getSetCookie();
			if (setCookieHeaders && setCookieHeaders.length > 0) {
				setCookieHeaders.forEach((cookie) => {
					response.headers.append('Set-Cookie', cookie);
				});
			}

			return response;
		} catch (error) {
			console.error('Middleware auth error:', error);
			return NextResponse.redirect(new URL('/signin', req.nextUrl));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
