import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './lib/supabase/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Supabase クライアントを作成（middleware 用）
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === '/login';
  const isProtectedPage = pathname.startsWith('/dashboard');

  // 未ログインで保護ページにアクセス → ログインページへ
  if (!session && isProtectedPage) {
    console.log('未ログインで保護ページにアクセス:', pathname);
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // ログイン済みでログインページへアクセス → ダッシュボードへ
  if (session && isAuthPage) {
    console.log('ログイン済みでログインページにアクセス:', pathname);
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // それ以外はそのまま通す
  console.log('その他のリクエスト:', pathname);
  return res;
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
};
