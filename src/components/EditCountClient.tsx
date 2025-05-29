'use client';

import { Count } from '@/interfaces/Count';
import { useState } from 'react';
import { DurationCounter } from './DurationCounter';
import { CountForm } from './CountForm';
import { createClient } from '@/lib/supabase/client';

type Props = {
  count: Count;
};

export default function EditCountClient({ count }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localCount, setLocalCount] = useState(count);

  const handleSubmit = async (values: {
    title: string;
    startDate: string;
    goalDate: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
  }) => {
    setLoading(true);
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
      }
    } finally {
      setLoading(false);
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
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setIsEditing(true)}
        >
          編集
        </button>
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
