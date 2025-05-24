'use client';
import LogoutBtn from '@/components/LogoutBtn';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  console.log('user', user);
  // ユーザーがいなければログインページへリダイレクト
  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);
  if (user === null) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">ようこそ！{user?.user_metadata.name}さん</h1>
      <LogoutBtn />
    </div>
  );
}
