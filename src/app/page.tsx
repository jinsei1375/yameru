'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace('/dashboard');
      }
    };

    checkSession();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Yameru</h1>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
      >
        Googleでログイン
      </button>
    </main>
  );
}
