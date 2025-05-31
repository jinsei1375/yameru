'use client';
import { useState, useEffect } from 'react';

export function DurationCounter({ startDate }: { startDate: Date | string }) {
  const startTime =
    typeof startDate === 'string' ? new Date(startDate).getTime() : startDate.getTime();

  const [elapsed, setElapsed] = useState<number | null>(null); // 初期はnull

  useEffect(() => {
    const update = () => setElapsed(Date.now() - startTime);
    update(); // 初回更新

    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [startTime]);

  if (elapsed === null) return null; // 初期描画では何も出さない（SSR対策）

  const totalSeconds = Math.floor(elapsed / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return (
    <span>
      継続中：{days > 0 && <>{days}日</>}
      {hours}時間{minutes}分{seconds}秒
    </span>
  );
}
