import { createClient } from '@/lib/supabase/server';
import { toCount } from '@/interfaces/Count';
import { CountCard } from '@/components/count/CountCard';
import { NavButton } from '@/components/NavButton';
import { PageTitle } from '@/components/PageTitle';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Suspense } from 'react';

export default async function CountListPage() {
  const supabase = await createClient();

  const { data: dbCounts, error } = await supabase
    .from('count_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('カウントの取得に失敗:', error.message);
    return <p>カウントの取得に失敗しました</p>;
  }

  const counts = dbCounts.map(toCount);

  return (
    <div className="p-4">
      <PageTitle>カウント一覧</PageTitle>
      <div className="flex justify-end mb-4">
        <NavButton href="/count/new" label="カウントを追加" />
      </div>
      <Suspense fallback={<LoadingSpinner size="lg" message="カウントを読み込み中..." />}>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {counts.map((count) => (
            <CountCard key={count.id} count={count} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
