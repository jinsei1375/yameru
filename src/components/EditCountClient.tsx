'use client';

import { Count } from '@/interfaces/Count';
import { useState } from 'react';
import { DurationCounter } from './DurationCounter';
import { CountForm } from './CountForm';

type Props = {
  count: Count;
};

export default function EditCountClient({ count }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    title: string;
    startDate: string;
    goalDate: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
  }) => {
    setLoading(true);
    try {
      // 更新処理
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div>
        <p>タイトル: {count.title}</p>
        <p>開始日: {new Date(count.startDate).toLocaleDateString()}</p>
        <DurationCounter startDate={count.startDate} />
        <p>目標日: {new Date(count.goalDate).toLocaleDateString()}</p>
        <p>セーブ時間/月: {count.saveTimePerMonth ? `${count.saveTimePerMonth}分` : '未設定'}</p>
        <p>
          セーブ金額/月: {''}
          {count.saveMoneyPerMonth ? `${count.saveMoneyPerMonth.toLocaleString()}円` : '未設定'}
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
          title: count.title,
          startDate: count.startDate.toISOString().slice(0, 10),
          goalDate: count.goalDate.toISOString().slice(0, 10),
          saveTimePerMonth: count.saveTimePerMonth ?? undefined,
          saveMoneyPerMonth: count.saveMoneyPerMonth ?? undefined,
        }}
        onSubmit={handleSubmit}
        loading={loading}
      />
    );
  }
}
