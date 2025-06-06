import { Count } from '@/interfaces/Count';
import { UrgeLog } from '@/interfaces/UrgeLog';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

interface CountDetailProps {
  count: Count;
  urgeLogs: UrgeLog[];
}

export default function CountDetail({ count, urgeLogs }: CountDetailProps) {
  // 継続日数を計算
  const streakDays = Math.floor(
    (new Date().getTime() - count.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{count.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Calendar className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">開始日</p>
              <p className="font-medium text-gray-900">
                {count.startDate.toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Clock className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">継続日数</p>
              <p className="font-medium text-gray-900">{streakDays}日</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
            <AlertTriangle className="text-purple-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">衝動ログ</p>
              <p className="font-medium text-gray-900">{urgeLogs.length}回</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">衝動ログ</h2>
          {urgeLogs.length === 0 ? (
            <p className="text-gray-500">まだ衝動ログはありません。</p>
          ) : (
            <div className="space-y-3">
              {urgeLogs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-600">
                      {new Date(log.occurredAt).toLocaleString('ja-JP')}
                    </p>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      衝動度: {log.intensity}/10
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <strong className="text-gray-700">きっかけ:</strong>
                      <p className="text-gray-600 mt-1">{log.trigger}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">そのときの思考:</strong>
                      <p className="text-gray-600 mt-1">{log.thought}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">とった行動:</strong>
                      <p className="text-gray-600 mt-1">{log.actionTaken}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
