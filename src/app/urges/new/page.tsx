'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/components/PageTitle';
import { UrgeLogForm } from '@/components/urge/UrgeLogForm';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';
import { createClient } from '@/lib/supabase/client';
import { Count, toCount } from '@/interfaces/Count';
import { toDbUrgeLogInsert } from '@/interfaces/UrgeLog';
import { NavButton } from '@/components/NavButton';

export default function NewUrgeLogPage() {
  const { user, loading: authLoading } = useAuth();
  const { showNotification, setLoading: setGlobalLoading } = useUI();
  const router = useRouter();

  const [counts, setCounts] = useState<Count[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchCounts();
    }
  }, [user, authLoading]);

  const fetchCounts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('count_items')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const fetchedCounts = data.map(toCount);
      setCounts(fetchedCounts);
    } catch (error) {
      console.error('Error fetching counts:', error);
      showNotification('カウントの取得に失敗しました', 'error');
    }
  };

  const handleSubmit = async (values: {
    countId: string;
    intensity: number;
    trigger: string;
    thought: string;
    actionTaken: string;
    occurredAt: Date;
  }) => {
    setIsSubmitting(true);
    setGlobalLoading(true);

    try {
      const supabase = createClient();

      const urgeLogData = toDbUrgeLogInsert(values);

      const { error } = await supabase.from('urge_logs').insert([urgeLogData]);

      if (error) throw error;

      showNotification('衝動ログを記録しました', 'success');
      router.push('/urges');
    } catch (error) {
      console.error('Error creating urge log:', error);
      showNotification('衝動ログの作成に失敗しました', 'error');
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <PageTitle>衝動ログ記録</PageTitle>
        <p className="text-center">ログインが必要です</p>
      </div>
    );
  }

  if (counts.length === 0) {
    return (
      <div className="p-4">
        <PageTitle>衝動ログ記録</PageTitle>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">まずはカウントを作成してください</p>
          <NavButton href="/count/new" label="カウントを作成する" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageTitle>衝動ログ記録</PageTitle>
      <UrgeLogForm counts={counts} onSubmit={handleSubmit} loading={isSubmitting} />
    </div>
  );
}
