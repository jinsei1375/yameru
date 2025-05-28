import EditCountClient from '@/components/EditCountClient';
import { PageTitle } from '@/components/PageTitle';
import { createClient } from '@/lib/supabase/server';
import { toCount } from '@/types/Count';
import { notFound } from 'next/navigation';

export default async function CountEditPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: count, error } = await supabase
    .from('count_items')
    .select('*')
    .eq('id', id)
    .single();
  const countClient = toCount(count);

  if (error || !count) return notFound();

  return (
    <div className="p-4 max-w-md mx-auto">
      <PageTitle>カウント編集</PageTitle>
      <EditCountClient count={countClient} />
    </div>
  );
}
