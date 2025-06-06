import { Count } from '@/interfaces/Count';
import { UrgeLog } from '@/interfaces/UrgeLog';
import { Trophy, Zap, Calendar } from 'lucide-react';

interface AchievementDisplayProps {
  counts: Count[];
  weeklyUrgeLogs: UrgeLog[];
}

export default function AchievementDisplay({ counts, weeklyUrgeLogs }: AchievementDisplayProps) {
  // 最長継続期間を計算
  const longestStreak = counts.reduce((max, count) => {
    const daysSinceStart = Math.floor(
      (new Date().getTime() - count.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(max, daysSinceStart);
  }, 0);

  // 完了したカウント数
  const completedCounts = counts.filter((count) => count.isCompleted).length;

  // 今週の平均衝動度
  const avgIntensity =
    weeklyUrgeLogs.length > 0
      ? (
          weeklyUrgeLogs.reduce((sum, log) => sum + log.intensity, 0) / weeklyUrgeLogs.length
        ).toFixed(1)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="text-yellow-500" size={20} />
        達成状況
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 最長継続期間 */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Calendar className="mx-auto text-green-600 mb-2" size={24} />
          <div className="text-2xl font-bold text-green-600">{longestStreak}</div>
          <p className="text-sm text-gray-600">最長継続日数</p>
        </div>

        {/* 達成したカウント */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Trophy className="mx-auto text-blue-600 mb-2" size={24} />
          <div className="text-2xl font-bold text-blue-600">{completedCounts}</div>
          <p className="text-sm text-gray-600">達成したカウント</p>
        </div>

        {/* 今週の平均衝動度 */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Zap className="mx-auto text-purple-600 mb-2" size={24} />
          <div className="text-2xl font-bold text-purple-600">
            {weeklyUrgeLogs.length > 0 ? `${avgIntensity}/10` : '-'}
          </div>
          <p className="text-sm text-gray-600">今週の平均衝動度</p>
        </div>
      </div>
    </div>
  );
}
