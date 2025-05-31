'use client';

import { useAuth } from '@/contexts/AuthContext';
import { MenuModal } from '@/components/MenuModal';
import { useUI } from '@/contexts/UIContext';
import { NavButton } from '@/components/NavButton';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const { user } = useAuth();
  const { openUserMenu } = useUI();

  return (
    <header className="flex justify-between items-center p-4 shadow">
      <h1 className="text-xl font-bold">
        <Link href={user ? '/home' : '/'} className="text-xl font-bold hover:opacity-80 transition">
          Yameru
        </Link>
      </h1>

      {user ? (
        <button onClick={() => openUserMenu()} className="flex items-center space-x-4">
          <Image
            src={user.user_metadata?.avatar_url || '/default-avatar.png'}
            alt="User avatar"
            className="w-8 h-8 rounded-full cursor-pointer"
            width={32}
            height={32}
          />
        </button>
      ) : (
        <NavButton href="/login" label="ログイン" />
      )}
      <MenuModal />
    </header>
  );
}
