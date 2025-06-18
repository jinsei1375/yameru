'use client';
import { Count } from '@/interfaces/Count';
import { DurationCounter } from '@/components/count/DurationCounter';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUI } from '@/contexts/UIContext';
import {
  calculateDaysLeftJST,
  calculateDaysPassedJST,
  calculateProgressJST,
} from '@/lib/dateUtils';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, RefreshCw, Share, X as XIcon } from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ResetCountModal } from '@/components/count/ResetCountModal';
import { SnsShareModal } from '@/components/SnsShareModal';

type Props = {
  count: Count;
};

export function CountCard({ count }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { showNotification, setLoading: setGlobalLoading } = useUI();
  const router = useRouter();

  const daysLeft = count.goalDate ? calculateDaysLeftJST(count.goalDate) : 0;
  const progress = count.goalDate ? calculateProgressJST(count.startDate, count.goalDate) : 0;
  const daysPassed = calculateDaysPassedJST(count.startDate);

  const handleDetail = () => {
    setGlobalLoading(true);
    router.push(`/count/${count.id}/edit`);
  };

  const handleComplete = () => {
    setIsCompleteModalOpen(true);
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const confirmComplete = async () => {
    setIsLoading(true);
    setGlobalLoading(true);
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

      showNotification('カウントを完了しました！', 'success');
      router.refresh();
    } catch (error) {
      console.error('完了処理に失敗:', error);
      showNotification('完了処理に失敗しました', 'error');
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
      setIsCompleteModalOpen(false);
    }
  };

  const calculateTotalSavings = () => {
    const monthlySavings = count.saveMoneyPerMonth || 0;
    const monthlyTimeSavings = count.saveTimePerMonth || 0;
    const currentSavings = Math.round(monthlySavings * (daysPassed / 30));
    const currentTimeSavings = Math.round(monthlyTimeSavings * (daysPassed / 30));
    const failedMoney = count.failedMoney ?? 0;
    const failedTime = count.failedTime ?? 0;

    return {
      money: currentSavings - failedMoney,
      time: currentTimeSavings - failedTime,
    };
  };

  const savings = calculateTotalSavings();
  const failedMoney = count.failedMoney ?? 0;
  const failedTime = count.failedTime ?? 0;

  // リセット済みかどうかの判定
  const isReset = failedMoney > 0 || failedTime > 0;

  // シェア用テキスト生成
  const shareUrl = process.env.NEXT_PUBLIC_SHARE_URL;
  const shareText = `「${count.title}」を${daysPassed}日継続中！\n${
    savings.money > 0 ? `${savings.money.toLocaleString()}円` : ''
  }${savings.money > 0 && savings.time > 0 ? '・' : ''}${
    savings.time > 0 ? `${savings.time}分` : ''
  }節約中\n${shareUrl}\n#Yameru`;

  return (
    <>
      <div
        className="relative bg-white rounded-2xl shadow p-4 border hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleDetail}
      >
        {/* 完了済みかつリセット済みの場合の表示 */}
        {count.isCompleted && isReset && (
          <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <RefreshCw size={16} />
              <span className="text-sm font-medium">リセット済み</span>
            </div>
          </div>
        )}

        {/* 完了済みかつリセットなしの場合の表示 */}
        {count.isCompleted && !isReset && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">達成済み</span>
            </div>
          </div>
        )}

        {/* 進行中の場合の表示 */}
        {!count.isCompleted && !isReset && (
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
              count.isCompleted || isReset ? 'text-gray-500' : 'text-gray-700'
            }`}
          >
            {count.title}
          </h2>
          <span
            className={`text-sm ${
              count.isCompleted || isReset ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {count.goalDate && !count.isCompleted && `残り${daysLeft}日`}
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
            <span className="inline-flex items-center gap-1">
              {savings.money.toLocaleString()} 円{count.isCompleted ? '節約済み' : '節約中'}
            </span>
            {failedMoney > 0 && (
              <span className="text-red-500 ml-2">(損失: {failedMoney.toLocaleString()}円)</span>
            )}
          </p>
        )}

        {count.saveTimePerMonth && count.saveTimePerMonth > 0 && (
          <p className={`text-sm ${count.isCompleted ? 'text-gray-500' : 'text-gray-700'}`}>
            <span className="inline-flex items-center gap-1">
              {savings.time} 分{count.isCompleted ? '節約済み' : '節約中'}
            </span>
            {failedTime > 0 && <span className="text-red-500 ml-2">(損失: {failedTime}分)</span>}
          </p>
        )}

        {count.goalDate && !count.isCompleted && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">{progress}%</p>
          </div>
        )}

        {/* アクションボタン */}
        {!count.isCompleted && (
          <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={14} />
              リセット
            </button>
            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={14} />
              {isLoading ? '処理中...' : '達成'}
            </button>
          </div>
        )}

        {/* SNSシェアボタン */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsShareModalOpen(true);
            }}
            className="f"
            aria-label="シェア"
            title="シェア"
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isCompleteModalOpen}
        onCancel={() => setIsCompleteModalOpen(false)}
        onConfirm={confirmComplete}
        title="カウントを完了"
        message="このカウントを完了としてマークしますか？この操作は取り消せません。"
        confirmButtonStyle="success"
      />

      <ResetCountModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        count={count}
      />

      <SnsShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareText={shareText}
      />
    </>
  );
}
