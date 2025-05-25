'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
        queryParams: {
          prompt: 'select_account', // もしくは 'consent'
        },
      },
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('✅ current session:', data.session);
      if (data.session) {
        router.push('/dashboard'); // セッションがあれば強制リダイレクト
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">Yameru にログイン</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
      >
        Googleでログイン
      </button>
    </div>
  );
}
