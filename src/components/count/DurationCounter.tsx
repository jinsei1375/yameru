'use client';
import { useState, useEffect } from 'react';
import { calculateElapsedTimeJST } from '@/lib/dateUtils';

export function DurationCounter({
  startDate,
  isCompleted = false,
  completedDate,
}: {
  startDate: Date | string;
  isCompleted?: boolean;
  completedDate?: Date | string;
}) {
  const [elapsed, setElapsed] = useState<number | null>(null); // 初期はnull

  useEffect(() => {
    const update = () => {
      if (isCompleted && completedDate) {
        // 達成済みの場合は、開始日から完了日までの期間を計算
        const start = new Date(startDate);
        const end = new Date(completedDate);
        setElapsed(end.getTime() - start.getTime());
      } else {
        // 継続中の場合は現在までの期間を計算
        setElapsed(calculateElapsedTimeJST(startDate));
      }
    };

    update(); // 初回更新

    if (!isCompleted) {
      // 継続中の場合のみ定期更新
      const intervalId = setInterval(update, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startDate, isCompleted, completedDate]);

  if (elapsed === null) return null; // 初期描画では何も出さない（SSR対策）

  const totalSeconds = Math.floor(elapsed / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  const prefix = isCompleted ? '継続期間：' : '継続中：';

  if (isCompleted) {
    // 達成済みの場合は日数のみ表示
    return (
      <span>
        {prefix}
        {days}日
      </span>
    );
  }

  // 継続中の場合は詳細表示
  return (
    <span>
      {prefix}
      {days > 0 && <>{days}日</>}
      {hours}時間{minutes}分{seconds}秒
    </span>
  );
}
