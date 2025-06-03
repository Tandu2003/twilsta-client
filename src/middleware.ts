import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/', '/search', '/[username]'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/verify-email', '/reset-password'];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Nếu đang ở các trang auth thì skip luôn middleware xác thực để tránh lặp
  if (AUTH_ROUTES.includes(pathname)) {
    // Nhưng nếu user đã đăng nhập rồi mà vẫn vào trang auth thì redirect về /
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (accessToken || refreshToken) {
      // Gọi API xác thực token
      const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
        },
        credentials: 'include',
      });

      if (authRes.ok) {
        const response = await authRes.json();
        if (response.success && response.data.isValid === true) {
          url.pathname = '/';
          return NextResponse.redirect(url);
        }
      }
    }
    return NextResponse.next();
  }

  // Với các route cần bảo vệ
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // Nếu đang ở các route cần bảo vệ
  if (isProtectedRoute) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!accessToken && !refreshToken) {
      // Chưa có token thì redirect về login
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Gọi API xác thực token
    const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
      credentials: 'include',
    });

    if (!authRes.ok) {
      // API lỗi thì redirect login luôn
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    const response = await authRes.json();

    if (!(response.success && response.data.isValid === true)) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Nếu hợp lệ thì cho qua
    return NextResponse.next();
  }

  // Các route không phải auth hay protected, cho qua luôn
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!auth/check-auth|_next|favicon.ico).*)'],
};
