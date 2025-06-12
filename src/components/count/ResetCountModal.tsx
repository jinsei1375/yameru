'use client';

import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Count } from '@/interfaces/Count';
import { createClient } from '@/lib/supabase/client';
import { useUI } from '@/contexts/UIContext';
import { useRouter } from 'next/navigation';

interface ResetCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  count: Count;
}

export function ResetCountModal({ isOpen, onClose, count }: ResetCountModalProps) {
  const [failedMoney, setFailedMoney] = useState<string>('');
  const [failedTime, setFailedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRetry, setShouldRetry] = useState(false);
  const { showNotification, setLoading: setGlobalLoading } = useUI();
  const router = useRouter();

  const handleReset = async () => {
    setIsSubmitting(true);
    setGlobalLoading(true);
    try {
      const supabase = createClient();

      // 1. 既存のカウントを完了済みに更新
      const { error: updateError } = await supabase
        .from('count_items')
        .update({
          is_completed: true,
          completed_date: new Date().toISOString(),
          failed_money: failedMoney ? Number(failedMoney) : 0,
          failed_time: failedTime ? Number(failedTime) : 0,
        })
        .eq('id', count.id);

      if (updateError) throw updateError;

      // 2. チェックが入っている場合は新しいカウントを作成
      if (shouldRetry) {
        const newCount = {
          user_id: count.userId,
          title: count.title,
          start_date: new Date().toISOString(),
          goal_date: count.goalDate?.toISOString() ?? null,
          save_time_per_month: count.saveTimePerMonth,
          save_money_per_month: count.saveMoneyPerMonth,
          reason: count.reason,
          commitment: count.commitment,
          is_completed: false,
        };

        const { error: insertError } = await supabase.from('count_items').insert([newCount]);

        if (insertError) throw insertError;
      }

      showNotification('カウントをリセットしました', 'success');
      router.refresh();
      onClose();
    } catch (error) {
      console.error('リセット処理に失敗:', error);
      showNotification('リセット処理に失敗しました', 'error');
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={onClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30"
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-80 mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <DialogTitle className="text-lg font-semibold text-gray-900 mb-4 text-center">
                カウントをリセット
              </DialogTitle>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    損失した金額（円）
                  </label>
                  <input
                    type="number"
                    value={failedMoney}
                    onChange={(e) => setFailedMoney(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例: 5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    損失した時間（分）
                  </label>
                  <input
                    type="number"
                    value={failedTime}
                    onChange={(e) => setFailedTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例: 60"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="retry"
                    checked={shouldRetry}
                    onChange={(e) => setShouldRetry(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="retry" className="text-sm text-gray-700">
                    同じ条件で再挑戦する
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-400 text-white rounded w-full max-w-[120px] hover:bg-gray-500 transition-colors"
                    disabled={isSubmitting}
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-green-500 text-white rounded w-full max-w-[120px] hover:bg-green-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '処理中...' : 'リセット'}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
