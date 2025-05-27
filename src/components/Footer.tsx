'use client';

import { Home, Zap, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'ホーム', icon: Home },
  { href: '/urges', label: '衝動ログ', icon: Zap },
  { href: '/count', label: 'カウント', icon: Clock },
];
export function Footer() {
  const pathname = usePathname();
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-around bg-gray-100 p-3 border-t">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center text-xs rounded-md px-3 py-1 transition-colors
              ${isActive ? 'bg-gray-300 text-black font-bold' : 'text-gray-500 hover:bg-gray-200'}
            `}
          >
            <Icon aria-hidden="true" className="w-6 h-6" />
            {label}
          </Link>
        );
      })}
    </footer>
  );
}
