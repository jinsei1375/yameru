import { Count } from '@/interfaces/Count';
import { Target } from 'lucide-react';
import Link from 'next/link';

interface ActiveCountsCardProps {
  counts: Count[];
}

export default function ActiveCountsCard({ counts }: ActiveCountsCardProps) {
  const activeCounts = counts.filter((count) => !count.isCompleted);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-400">
      <div className="flex items-center gap-2 mb-4">
        <Target className="text-blue-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">アクティブなカウント</h3>
      </div>

      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">{activeCounts.length}</div>
        <p className="text-gray-600 text-sm mb-4">個のカウントが進行中</p>

        {activeCounts.length === 0 ? (
          <div className="text-gray-500 text-sm">
            <p className="mb-2">まだアクティブなカウントがありません</p>
            <Link href="/count/new" className="text-blue-600 hover:text-blue-800 underline">
              新しいカウントを作成
            </Link>
          </div>
        ) : (
          <Link href="/count" className="text-blue-600 hover:text-blue-800 text-sm underline">
            カウント一覧を見る
          </Link>
        )}
      </div>
    </div>
  );
}
