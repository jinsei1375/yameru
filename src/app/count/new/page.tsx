'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CountForm } from '@/components/CountForm';
import { Count, DbCountInsert, toDbCountInsert } from '@/types/Count';
import { PageTitle } from '@/components/PageTitle';

export default function NewCountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>読み込み中...</p>;
  if (!user) return <p>ログインが必要です</p>; // middlewareで弾かれてるはずだけど念のため

  const handleSubmit = async (values: {
    title: string;
    startDate: string;
    goalDate: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
  }) => {
    const supabase = createClient();

    // フロント用のCount型に変換（Date型に直す）
    const countToSave: Omit<Count, 'id'> = {
      userId: user.id,
      title: values.title,
      startDate: new Date(values.startDate),
      goalDate: new Date(values.goalDate),
      saveTimePerMonth: values.saveTimePerMonth,
      saveMoneyPerMonth: values.saveMoneyPerMonth,
    };
    const dataToSave: DbCountInsert = toDbCountInsert(countToSave);

    const { error } = await supabase.from('count_items').insert([dataToSave]);

    if (error) {
      console.error('カウントの作成に失敗:', error);
      alert('カウントの作成に失敗しました。もう一度お試しください。');
      return;
    }

    router.push('/count');
  };

  return (
    <div className="p-4">
      <PageTitle>新しいカウントを作成</PageTitle>
      <CountForm onSubmit={handleSubmit} />
    </div>
  );
}
