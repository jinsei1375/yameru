'use client';

import { useState, useEffect } from 'react';

type CountFormProps = {
  initialValues?: {
    title: string;
    startDate: string;
    goalDate: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
  };
  onSubmit: (values: {
    title: string;
    startDate: string;
    goalDate: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
  }) => Promise<void>;
  loading?: boolean;
};

export function CountForm({ initialValues, onSubmit, loading }: CountFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? '');
  const [goalDate, setGoalDate] = useState(initialValues?.goalDate ?? '');
  const [saveTime, setSaveTime] = useState(initialValues?.saveTimePerMonth?.toString() ?? '');
  const [saveMoney, setSaveMoney] = useState(initialValues?.saveMoneyPerMonth?.toString() ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      startDate,
      goalDate,
      saveTimePerMonth: saveTime ? Number(saveTime) : undefined,
      saveMoneyPerMonth: saveMoney ? Number(saveMoney) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">カウント名</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">開始日</label>
        <input
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">ゴール日</label>
        <input
          type="date"
          required
          value={goalDate}
          onChange={(e) => setGoalDate(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">1ヶ月でセーブする時間（分）</label>
        <input
          type="number"
          value={saveTime}
          onChange={(e) => setSaveTime(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">1ヶ月でセーブする金額（円）</label>
        <input
          type="number"
          value={saveMoney}
          onChange={(e) => setSaveMoney(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-500 text-white py-2 rounded font-bold"
      >
        {loading ? '保存中...' : '保存'}
      </button>
    </form>
  );
}
