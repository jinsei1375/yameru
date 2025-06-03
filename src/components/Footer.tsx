'use client';

import { Home, Zap, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/home', label: 'ホーム', icon: Home },
  { href: '/count', label: 'カウント', icon: Clock },
  { href: '/urges', label: '衝動ログ', icon: Zap },
];

const excludedPaths = ['/login', '/register', '/'];
export function Footer() {
  const pathname = usePathname();
  if (pathname && excludedPaths.includes(pathname)) {
    return null; // ログイン・登録画面ではフッターを表示しない
  }
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-around bg-gray-100 py-2 px-3 border-t z-10 h-16">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center text-xs rounded-md px-2 py-1 transition-colors flex-1
              ${isActive ? 'bg-gray-300 text-black font-bold' : 'text-gray-500 hover:bg-gray-200'}
            `}
          >
            <Icon aria-hidden="true" className="w-5 h-5 mb-1" />
            {label}
          </Link>
        );
      })}
    </footer>
  );
}
