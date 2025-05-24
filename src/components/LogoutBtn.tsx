// components/LogoutButton.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LogoutBtn() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // ログインページへリダイレクト
  };

  return (
    <button onClick={handleLogout} className="text-sm text-gray-600 hover:underline">
      ログアウト
    </button>
  );
}
