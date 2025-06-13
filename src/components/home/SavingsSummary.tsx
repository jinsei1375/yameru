'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Coins, PiggyBank, Loader2 } from 'lucide-react';
import CountUp from 'react-countup';

interface Savings {
  totalMoney: number;
  totalTime: number;
  failedMoney: number;
  failedTime: number;
}

export function SavingsSummary() {
  const [savings, setSavings] = useState<Savings>({
    totalMoney: 0,
    totalTime: 0,
    failedMoney: 0,
    failedTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSavings = async () => {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data: counts, error } = await supabase
          .from('count_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        let totalMoney = 0;
        let totalTime = 0;
        let failedMoney = 0;
        let failedTime = 0;

        counts.forEach((count) => {
          if (count.is_completed) {
            // 完了済みのカウントの場合、失敗時の損失を加算
            failedMoney += count.failed_money || 0;
            failedTime += count.failed_time || 0;
          } else {
            // 進行中のカウントの場合、節約金額・時間を計算
            const startDate = new Date(count.start_date);
            const now = new Date();
            const monthsPassed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

            if (count.save_money_per_month) {
              totalMoney += count.save_money_per_month * monthsPassed;
            }
            if (count.save_time_per_month) {
              totalTime += count.save_time_per_month * monthsPassed;
            }
          }
        });

        setSavings({
          totalMoney,
          totalTime,
          failedMoney,
          failedTime,
        });
      } catch (error) {
        console.error('節約データの取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-4 border">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  const netMoney = savings.totalMoney - savings.failedMoney;
  const netTime = savings.totalTime - savings.failedTime;

  return (
    <div className="bg-white rounded-2xl shadow p-4 border">
      <div className="flex items-center space-x-2 mb-4">
        <PiggyBank className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-700">節約サマリー</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-700">節約金額</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-700">
              <CountUp end={netMoney} duration={2} separator="," decimals={0} preserveValue />円
            </div>
            {savings.failedMoney > 0 && (
              <div className="text-sm text-red-500">
                損失: {savings.failedMoney.toLocaleString()}円
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">節約時間</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-700">
              {netTime < 0 ? '-' : ''}
              <CountUp end={Math.abs(Math.floor(netTime / 60))} duration={2} preserveValue />
              時間
              <CountUp end={Math.abs(Math.floor(netTime % 60))} duration={2} preserveValue />分
            </div>
            {savings.failedTime > 0 && (
              <div className="text-sm text-red-500">
                損失: {Math.floor(savings.failedTime / 60)}時間{savings.failedTime % 60}分
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
