import { createClient } from '@/lib/supabase/server';
import { toCount } from '@/types/Count';
import { CountCard } from '@/components/CountCard';

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
      <h1 className="text-xl font-bold mb-4">カウント一覧</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {counts.map((count) => (
          <CountCard key={count.id} count={count} />
        ))}
      </div>
    </div>
  );
}
