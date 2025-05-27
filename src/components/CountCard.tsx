import { Count } from '@/types/Count';
import { DurationCounter } from './DurationCounter';

type Props = {
  count: Count;
};

export function CountCard({ count }: Props) {
  const now = new Date();
  const daysPassed = Math.floor(
    (now.getTime() - count.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysLeft = Math.ceil((count.goalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const totalDuration = Math.ceil(
    (count.goalDate.getTime() - count.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const progress = Math.min(100, Math.floor((daysPassed / totalDuration) * 100));

  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
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
  );
}
