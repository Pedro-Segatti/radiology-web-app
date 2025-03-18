import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

const PUBLIC_ROUTES = ['/login', '/register', '/reset-password', '/public-page'];

export async function middleware(req) {
  const { nextUrl } = req;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  const token = cookies().get("token")?.value;

  try {    
    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token && nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login-image.jpg).*)'],
};
