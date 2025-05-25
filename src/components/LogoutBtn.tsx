'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <button
      onClick={async () => {
        await signOut();
        window.location.href = '/login';
      }}
      className="px-3 py-1 bg-red-500 text-white rounded"
    >
      ログアウト
    </button>
  );
}
