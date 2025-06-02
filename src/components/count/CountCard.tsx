'use client';
import { Count } from '@/types/Count';
import { DurationCounter } from '@/components/count/DurationCounter';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUI } from '@/contexts/UIContext';
import { calculateDaysLeftJST, calculateProgressJST } from '@/lib/dateUtils';

type Props = {
  count: Count;
};

export function CountCard({ count }: Props) {
  const router = useRouter();
  const { setLoading: setGlobalLoading } = useUI();

  // コンポーネントアンマウント時にローディングを解除
  useEffect(() => {
    return () => {
      setGlobalLoading(false);
    };
  }, [setGlobalLoading]);

  // 日本時間基準での日数計算
  const daysLeft = calculateDaysLeftJST(count.goalDate);
  const progress = calculateProgressJST(count.startDate, count.goalDate);

  const handleClick = () => {
    setGlobalLoading(true);
    router.push(`/count/${count.id}/edit`);
  };

  return (
    <div onClick={handleClick} className="block cursor-pointer">
      <div className="bg-white rounded-2xl shadow p-4 border hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-700">{count.title}</h2>
          <span className="text-sm text-gray-500">残り{daysLeft}日</span>
        </div>
        <p className="text-sm text-gray-700">
          <DurationCounter startDate={count.startDate} />
        </p>
        {count.saveMoneyPerMonth && (
          <p className="text-sm text-gray-700">
            月 {count.saveMoneyPerMonth.toLocaleString()} 円節約中
          </p>
        )}
        {count.saveTimePerMonth && (
          <p className="text-sm text-gray-700">月 {count.saveTimePerMonth} 時間節約中</p>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
