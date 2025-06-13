'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useUI } from '@/contexts/UIContext';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { signOut } = useAuth();
  const { setLoading: setGlobalLoading } = useUI();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setGlobalLoading(true);
    try {
      await signOut();
      // キャッシュを無効化してログインページにリダイレクト
      router.push('/login?t=' + new Date().getTime());
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setIsLoggingOut(false);
      setGlobalLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
    >
      {isLoggingOut ? (
        <>
          <LoadingSpinner size="sm" color="white" />
          <span className="ml-2">ログアウト中...</span>
        </>
      ) : (
        'ログアウト'
      )}
    </button>
  );
}
