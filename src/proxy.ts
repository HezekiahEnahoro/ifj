import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminUI  = pathname.startsWith('/admin')     && pathname !== '/admin/login';
  const isAdminAPI = pathname.startsWith('/api/admin') && pathname !== '/api/admin/auth';

  if (isAdminUI || isAdminAPI) {
    const session  = request.cookies.get('admin_session');
    const expected = process.env.ADMIN_SESSION_VALUE;

    if (!session || !expected || session.value !== expected) {
      if (isAdminAPI) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
