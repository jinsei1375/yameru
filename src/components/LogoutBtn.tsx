'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useUI } from '@/contexts/UIContext';

export default function LogoutButton() {
  const { signOut } = useAuth();
  const { setLoading: setGlobalLoading } = useUI();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setGlobalLoading(true);
    try {
      await signOut();
      window.location.href = '/login';
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
