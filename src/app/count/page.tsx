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
  const activeCounts = counts.filter((count) => !count.isCompleted);
  const completedCounts = counts.filter((count) => count.isCompleted);

  return (
    <div className="p-4">
      <PageTitle>カウント一覧</PageTitle>
      <div className="flex justify-end mb-4">
        <NavButton href="/count/new" label="カウントを追加" />
      </div>

      <Suspense fallback={<LoadingSpinner size="lg" message="カウントを読み込み中..." />}>
        {/* アクティブなカウント */}
        {activeCounts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">進行中のカウント</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {activeCounts.map((count) => (
                <CountCard key={count.id} count={count} />
              ))}
            </div>
          </div>
        )}

        {/* 完了済みのカウント */}
        {completedCounts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">達成済みのカウント</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {completedCounts.map((count) => (
                <CountCard key={count.id} count={count} />
              ))}
            </div>
          </div>
        )}

        {/* カウントが1つもない場合 */}
        {counts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">まだカウントがありません</p>
            <NavButton href="/count/new" label="最初のカウントを作成" />
          </div>
        )}
      </Suspense>
    </div>
  );
}
