'use client';

import { useAuth } from '@/contexts/AuthContext';
import { MenuModal } from './MenuModal';
import { useUI } from '@/contexts/UIContext';

export function Header() {
  const { user, loading } = useAuth();
  const { openUserMenu } = useUI();

  if (loading) return <div>Loading...</div>;

  return (
    <header className="flex justify-between items-center p-4 shadow">
      <h1 className="text-xl font-bold">Yameru</h1>

      {user && (
        <button onClick={() => openUserMenu()} className="flex items-center space-x-4">
          <img
            src={user.user_metadata?.avatar_url || '/default-avatar.png'}
            alt="User avatar"
            className="w-8 h-8 rounded-full cursor-pointer"
            // ここにクリックでサイドバー表示の処理を追加
          />
        </button>
      )}
      <MenuModal />
    </header>
  );
}
