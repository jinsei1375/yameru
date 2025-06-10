'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Coins } from 'lucide-react';

interface Savings {
  totalMoney: number;
  totalTime: number;
}

export default function SavingsSummary() {
  const { user } = useAuth();
  const [savings, setSavings] = useState<Savings>({ totalMoney: 0, totalTime: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: counts, error } = await supabase.from('count_items').select('*');

        if (error) {
          console.error('節約データの取得に失敗:', error);
          return;
        }

        const total = counts.reduce(
          (acc, count) => {
            const startDate = new Date(count.start_date);
            const endDate = count.is_completed ? new Date(count.completed_date) : new Date();
            const daysDiff = Math.floor(
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            return {
              totalMoney: acc.totalMoney + (count.save_money_per_month / 30 || 0) * daysDiff,
              totalTime: acc.totalTime + (count.save_time_per_month / 30 || 0) * daysDiff,
            };
          },
          { totalMoney: 0, totalTime: 0 }
        );

        setSavings(total);
      } catch (error) {
        console.error('節約データの取得中にエラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavings();
  }, [user]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-400">
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // 時間を時間と分に変換
  const hours = Math.floor(savings.totalTime / 60);
  const minutes = savings.totalTime % 60;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-400">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">節約サマリー</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <Coins className="text-yellow-500" size={20} />
          <div>
            <p className="text-sm text-gray-500">節約金額</p>
            <p className="text-lg font-medium text-gray-900">
              ¥{savings.totalMoney.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <Clock className="text-blue-500" size={20} />
          <div>
            <p className="text-sm text-gray-500">節約時間</p>
            <p className="text-lg font-medium text-gray-900">
              {hours}時間{minutes}分
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
