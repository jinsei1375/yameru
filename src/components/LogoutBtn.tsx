'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('ログアウトエラー:', error.message);
      return;
    }

    // クッキーとセッションの即時反映を促す
    router.refresh();
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="text-red-500">
      ログアウト
    </button>
  );
}
