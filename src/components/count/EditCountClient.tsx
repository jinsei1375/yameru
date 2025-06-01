'use client';

import { Count } from '@/interfaces/Count';
import { useState, useEffect } from 'react';
import { DurationCounter } from '@/components/count/DurationCounter';
import { CountForm } from '@/components/count/CountForm';
import { createClient } from '@/lib/supabase/client';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useRouter } from 'next/navigation';
import { useUI } from '@/contexts/UIContext';

type Props = {
  count: Count;
};

export default function EditCountClient({ count }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localCount, setLocalCount] = useState(count);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showNotification, setLoading: setGlobalLoading } = useUI();

  const router = useRouter();

  // コンポーネントマウント時にローディングを解除
  useEffect(() => {
    setGlobalLoading(false);
  }, [setGlobalLoading]);

  // 削除処理
  const handleDelete = async () => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('count_items').delete().eq('id', count.id);
      if (error) {
        console.error('削除に失敗:', error);
        alert('削除に失敗しました。');
        return;
      }
      router.push('/count'); // 削除後はカウント一覧にリダイレクト
      showNotification('削除しました', 'success');
    } finally {
      setLoading(false);
      setGlobalLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  // 保存処理
  const handleSubmit = async (values: {
    title: string;
    startDate: string;
    goalDate: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
  }) => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      const supabase = createClient();
      const updatedCount: Count = {
        ...localCount,
        title: values.title,
        startDate: new Date(values.startDate),
        goalDate: new Date(values.goalDate),
        saveTimePerMonth: values.saveTimePerMonth ? Number(values.saveTimePerMonth) : undefined,
        saveMoneyPerMonth: values.saveMoneyPerMonth ? Number(values.saveMoneyPerMonth) : undefined,
      };
      const { error } = await supabase
        .from('count_items')
        .update({
          title: updatedCount.title,
          start_date: updatedCount.startDate.toISOString(),
          goal_date: updatedCount.goalDate.toISOString(),
          save_time_per_month: updatedCount.saveTimePerMonth,
          save_money_per_month: updatedCount.saveMoneyPerMonth,
        })
        .eq('id', localCount.id);
      if (error) {
        console.error('カウントの更新に失敗:', error);
        alert('カウントの更新に失敗しました。もう一度お試しください。');
        return;
      } else {
        setLocalCount(updatedCount);
        setIsEditing(false);
        showNotification('保存に成功しました！', 'success');
      }
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div>
        <p>タイトル: {localCount.title}</p>
        <p>開始日: {new Date(localCount.startDate).toLocaleDateString()}</p>
        <DurationCounter startDate={localCount.startDate} />
        <p>目標日: {new Date(localCount.goalDate).toLocaleDateString()}</p>
        <p>
          セーブ時間/月:{' '}
          {localCount.saveTimePerMonth ? `${localCount.saveTimePerMonth}分` : '未設定'}
        </p>
        <p>
          セーブ金額/月:{' '}
          {localCount.saveMoneyPerMonth
            ? `${localCount.saveMoneyPerMonth.toLocaleString()}円`
            : '未設定'}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded w-full max-w-[120px]"
            onClick={() => setIsEditing(true)}
          >
            編集
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded w-full max-w-[120px]"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            削除
          </button>
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            title="カウントの削除"
            message="このカウントを削除してもよろしいですか？"
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        </div>
      </div>
    );
  } else {
    return (
      <CountForm
        initialValues={{
          title: localCount.title,
          startDate: new Date(localCount.startDate).toISOString().slice(0, 10),
          goalDate: new Date(localCount.goalDate).toISOString().slice(0, 10),
          saveTimePerMonth: localCount.saveTimePerMonth ?? undefined,
          saveMoneyPerMonth: localCount.saveMoneyPerMonth ?? undefined,
        }}
        onSubmit={handleSubmit}
        loading={loading}
      />
    );
  }
}
