import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './lib/supabase/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 保護したいパスのリスト
  const protectedPaths = ['/dashboard', '/profile', '/settings']; // 必要に応じて増やす

  const pathname = req.nextUrl.pathname;

  if (protectedPaths.some((path) => pathname.startsWith(path)) && !session) {
    // 未ログインなら /login にリダイレクト
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'], // 保護したいパスを指定
};
