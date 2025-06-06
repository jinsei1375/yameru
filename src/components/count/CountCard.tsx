'use client';
import { Count } from '@/interfaces/Count';
import { DurationCounter } from '@/components/count/DurationCounter';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUI } from '@/contexts/UIContext';
import { calculateDaysLeftJST, calculateProgressJST } from '@/lib/dateUtils';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, Eye } from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal';

type Props = {
  count: Count;
};

export function CountCard({ count }: Props) {
  const router = useRouter();
  const { setLoading: setGlobalLoading, showNotification } = useUI();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // コンポーネントアンマウント時にローディングを解除
  useEffect(() => {
    return () => {
      setGlobalLoading(false);
    };
  }, [setGlobalLoading]);

  // 日本時間基準での日数計算
  const daysLeft = calculateDaysLeftJST(count.goalDate);
  const progress = calculateProgressJST(count.startDate, count.goalDate);

  const handleDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGlobalLoading(true);
    router.push(`/count/${count.id}/edit`);
  };

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompleteModalOpen(true);
  };

  const confirmComplete = async () => {
    setIsCompleting(true);

    try {
      const supabase = createClient();
      const completedDate = new Date();

      const { error } = await supabase
        .from('count_items')
        .update({
          is_completed: true,
          completed_date: completedDate.toISOString(),
        })
        .eq('id', count.id);

      if (error) throw error;

      showNotification('カウントを達成しました！おめでとうございます！', 'success');
      router.refresh();
    } catch (error) {
      console.error('完了処理に失敗:', error);
      showNotification('完了処理に失敗しました', 'error');
    } finally {
      setIsCompleting(false);
      setIsCompleteModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 border hover:shadow-lg transition-shadow">
      {/* 完了済みの場合の表示 */}
      {count.isCompleted && (
        <div className="bg-green-100 border border-green-200 rounded-lg p-2 mb-3">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">達成済み</span>
          </div>
        </div>
      )}

      {/* 進行中の場合の表示 */}
      {!count.isCompleted && (
        <div className="bg-blue-100 border border-blue-200 rounded-lg p-2 mb-3">
          <div className="flex items-center gap-2 text-blue-800">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">進行中</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <h2
          className={`text-lg font-semibold ${
            count.isCompleted ? 'text-gray-500' : 'text-gray-700'
          }`}
        >
          {count.title}
        </h2>
        <span className={`text-sm ${count.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
          {count.isCompleted ? '完了' : `残り${daysLeft}日`}
        </span>
      </div>

      <p className={`text-sm ${count.isCompleted ? 'text-gray-500' : 'text-gray-700'}`}>
        <DurationCounter
          startDate={count.startDate}
          isCompleted={count.isCompleted}
          completedDate={count.completedDate}
        />
      </p>

      {count.saveMoneyPerMonth && count.saveMoneyPerMonth > 0 && (
        <p className={`text-sm ${count.isCompleted ? 'text-gray-500' : 'text-gray-700'}`}>
          月 {count.saveMoneyPerMonth.toLocaleString()} 円節約中
        </p>
      )}

      {count.saveTimePerMonth && count.saveTimePerMonth > 0 && (
        <p className={`text-sm ${count.isCompleted ? 'text-gray-500' : 'text-gray-700'}`}>
          月 {count.saveTimePerMonth} 時間節約中
        </p>
      )}

      <div className="mt-3 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">進捗</span>
          <span className="text-xs text-gray-500">
            {count.isCompleted ? '100%' : `${Math.round(progress)}%`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${count.isCompleted ? 'bg-green-400' : 'bg-yellow-400'}`}
            style={{ width: count.isCompleted ? '100%' : `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-2">
        <button
          onClick={handleDetail}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Eye size={14} />
          詳細
        </button>

        {!count.isCompleted && (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            <CheckCircle size={14} />
            {isCompleting ? '処理中...' : '達成'}
          </button>
        )}
      </div>

      {/* 完了確認モーダル */}
      <ConfirmModal
        isOpen={isCompleteModalOpen}
        title="目標達成の確認"
        message="このカウントを達成済みにしますか？一度達成にすると元に戻せません。"
        confirmButtonStyle="success"
        onConfirm={confirmComplete}
        onCancel={() => setIsCompleteModalOpen(false)}
      />
    </div>
  );
}
