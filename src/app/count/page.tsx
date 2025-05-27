import { createClient } from '@/lib/supabase/server';
import { toCount } from '@/types/Count';
import { CountCard } from '@/components/CountCard';
import { NavButton } from '@/components/NavButton';
import { PageTitle } from '@/components/PageTitle';

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
      <NavButton href="/count/new" label="カウントを追加" className="mb-4" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {counts.map((count) => (
          <CountCard key={count.id} count={count} />
        ))}
      </div>
    </div>
  );
}
