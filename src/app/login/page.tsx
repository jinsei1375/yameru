'use client';

import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // 必要に応じてリダイレクトURL指定（省略可能）
        // redirectTo: 'https://your-domain.com/dashboard',
      },
    });
    if (error) {
      alert('ログインエラー: ' + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 text-center">
      <h1 className="text-xl font-bold mb-6">Googleログイン</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-400 hover:bg-blue-500 px-6 py-3 rounded text-white font-semibold"
      >
        Googleでログイン・登録
      </button>
    </div>
  );
}
