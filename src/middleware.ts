import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/', '/search', '/[username]'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/verify-email', '/reset-password'];

// Prevent middleware loops by tracking refresh attempts
const REFRESH_HEADER = 'x-token-refresh-attempt';
const MAX_REFRESH_ATTEMPTS = 2;

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Track refresh attempts to prevent infinite loops
  const refreshAttempts = parseInt(request.headers.get(REFRESH_HEADER) || '0');

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
        const authResponse = await authRes.json();
        if (authResponse.success && authResponse.data.isValid === true) {
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
      // API lỗi - nếu 401 và có refresh token, thử refresh
      if (authRes.status === 401 && refreshToken && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
        try {
          const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `refreshToken=${refreshToken}`,
            },
            credentials: 'include',
          });

          if (refreshRes.ok) {
            // Refresh thành công, cho phép request tiếp tục với header đánh dấu
            const continueResponse = NextResponse.next();
            continueResponse.headers.set(REFRESH_HEADER, String(refreshAttempts + 1));
            return continueResponse;
          }
        } catch (error) {
          console.error('Middleware refresh failed:', error);
        }
      }

      // Refresh thất bại hoặc không có refresh token, redirect login
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    const authResponse = await authRes.json();

    if (!(authResponse.success && authResponse.data.isValid === true)) {
      // Token không hợp lệ - thử refresh nếu có
      if (refreshToken && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
        try {
          const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `refreshToken=${refreshToken}`,
            },
            credentials: 'include',
          });

          if (refreshRes.ok) {
            // Refresh thành công, cho phép request tiếp tục
            const retryResponse = NextResponse.next();
            retryResponse.headers.set(REFRESH_HEADER, String(refreshAttempts + 1));
            return retryResponse;
          }
        } catch (error) {
          console.error('Middleware refresh failed:', error);
        }
      }

      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Token hợp lệ, reset refresh attempts
    const successResponse = NextResponse.next();
    successResponse.headers.delete(REFRESH_HEADER);
    return successResponse;
  }

  // Các route không phải auth hay protected, cho qua luôn
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!auth/check-auth|_next|favicon.ico).*)'],
};
