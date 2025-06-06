import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface WeeklyUrgeLogsCardProps {
  count: number;
}

export default function WeeklyUrgeLogsCard({ count }: WeeklyUrgeLogsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-400">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-orange-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">今週の衝動ログ</h3>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600 mb-2">
          {count}
        </div>
        <p className="text-gray-600 text-sm mb-4">回記録されました</p>
        
        {count === 0 ? (
          <div className="text-gray-500 text-sm">
            <p className="mb-2">今週は衝動ログがありません</p>
            <p className="text-green-600 font-medium">素晴らしい調子です！</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Link 
              href="/urges" 
              className="text-orange-600 hover:text-orange-800 text-sm underline block"
            >
              ログを確認する
            </Link>
            <Link 
              href="/urges/new" 
              className="text-orange-600 hover:text-orange-800 text-sm underline block"
            >
              新しく記録する
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
