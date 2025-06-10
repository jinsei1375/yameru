'use client';

import { Count } from '@/interfaces/Count';
import { IfThenRule, toIfThenRule, toDbIfThenRuleInsert } from '@/interfaces/IfThenRule';
import { useState, useEffect, useCallback } from 'react';
import { DurationCounter } from '@/components/count/DurationCounter';
import { CountForm } from '@/components/count/CountForm';
import { createClient } from '@/lib/supabase/client';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useRouter } from 'next/navigation';
import { useUI } from '@/contexts/UIContext';
import { toLocaleDateStringJST } from '@/lib/dateUtils';

type Props = {
  count: Count;
};

export default function EditCountClient({ count }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localCount, setLocalCount] = useState(count);
  const [ifThenRules, setIfThenRules] = useState<IfThenRule[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const { showNotification, setLoading: setGlobalLoading } = useUI();

  const router = useRouter();

  // If-Thenルールを読み込む
  const loadIfThenRules = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('if_then_rules')
        .select('*')
        .eq('count_id', count.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('If-Thenルールの読み込みに失敗:', error);
        return;
      }

      if (data) {
        setIfThenRules(data.map(toIfThenRule));
      }
    } catch (error) {
      console.error('If-Thenルールの読み込み中にエラー:', error);
    }
  }, [count.id]);

  // コンポーネントマウント時にローディングを解除とIf-Thenルールを読み込み
  useEffect(() => {
    setGlobalLoading(false);
    loadIfThenRules();
  }, [setGlobalLoading, loadIfThenRules]);

  // 削除処理
  const handleDelete = async () => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      const supabase = createClient();

      // If-Thenルールを先に削除
      const { error: rulesDeleteError } = await supabase
        .from('if_then_rules')
        .delete()
        .eq('count_id', count.id);

      if (rulesDeleteError) {
        console.error('If-Thenルールの削除に失敗:', rulesDeleteError);
        alert('削除に失敗しました。');
        return;
      }

      // カウントを削除
      const { error } = await supabase.from('count_items').delete().eq('id', count.id);
      if (error) {
        console.error('削除に失敗:', error);
        alert('削除に失敗しました。');
        return;
      }
      router.push('/count'); // 削除後はカウント一覧にリダイレクト
      showNotification('削除しました', 'success');
    } finally {
      setLoading(false);
      setGlobalLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  // 完了処理
  const handleComplete = async () => {
    setLoading(true);
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

      if (error) {
        console.error('完了処理に失敗:', error);
        alert('完了処理に失敗しました。');
        return;
      }

      setLocalCount((prev) => ({
        ...prev,
        isCompleted: true,
        completedDate: completedDate,
      }));
      showNotification('カウントを達成しました！おめでとうございます！', 'success');
      router.push('/count');
    } finally {
      setLoading(false);
      setGlobalLoading(false);
      setIsCompleteModalOpen(false);
    }
  };

  // 保存処理
  const handleSubmit = async (values: {
    title: string;
    startDate: string;
    goalDate?: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
    reason?: string;
    commitment?: string;
    ifThenRules: Array<{
      ifCondition: string;
      thenAction: string;
    }>;
  }) => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      const supabase = createClient();
      const updatedCount: Count = {
        ...localCount,
        title: values.title,
        startDate: new Date(values.startDate),
        goalDate: values.goalDate ? new Date(values.goalDate) : undefined,
        saveTimePerMonth: values.saveTimePerMonth ? Number(values.saveTimePerMonth) : undefined,
        saveMoneyPerMonth: values.saveMoneyPerMonth ? Number(values.saveMoneyPerMonth) : undefined,
        reason: values.reason,
        commitment: values.commitment,
      };

      // カウント情報を更新
      const { error } = await supabase
        .from('count_items')
        .update({
          title: updatedCount.title,
          start_date: updatedCount.startDate.toISOString(),
          goal_date: updatedCount.goalDate?.toISOString() ?? null,
          save_time_per_month: updatedCount.saveTimePerMonth,
          save_money_per_month: updatedCount.saveMoneyPerMonth,
          reason: updatedCount.reason,
          commitment: updatedCount.commitment,
        })
        .eq('id', localCount.id);

      if (error) {
        console.error('カウントの更新に失敗:', error);
        alert('カウントの更新に失敗しました。もう一度お試しください。');
        return;
      }

      // 既存のIf-Thenルールを削除
      const { error: deleteRulesError } = await supabase
        .from('if_then_rules')
        .delete()
        .eq('count_id', localCount.id);

      if (deleteRulesError) {
        console.error('既存If-Thenルール削除に失敗:', deleteRulesError);
        alert('If-Thenルールの更新に失敗しました。');
        return;
      }

      // 新しいIf-Thenルールを挿入
      if (values.ifThenRules && values.ifThenRules.length > 0) {
        const ifThenRulesData = values.ifThenRules.map((rule) =>
          toDbIfThenRuleInsert({
            countItemId: localCount.id,
            ifCondition: rule.ifCondition,
            thenAction: rule.thenAction,
          })
        );

        const { error: insertRulesError } = await supabase
          .from('if_then_rules')
          .insert(ifThenRulesData);

        if (insertRulesError) {
          console.error('If-Thenルールの挿入に失敗:', insertRulesError);
          alert('If-Thenルールの更新に失敗しました。');
          return;
        }
      }

      // 状態を更新
      setLocalCount(updatedCount);
      await loadIfThenRules(); // If-Thenルールを再読み込み
      setIsEditing(false);
      showNotification('保存に成功しました！', 'success');
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div>
        {/* 完了済みの場合の表示 */}
        {localCount.isCompleted && (
          <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-4">
            <div className="text-green-800 font-medium text-center">
              🎉 このカウントは達成済みです！ 🎉
            </div>
          </div>
        )}

        <p>タイトル: {localCount.title}</p>
        <p>開始日: {toLocaleDateStringJST(localCount.startDate)}</p>
        {localCount.goalDate && <p>目標日: {toLocaleDateStringJST(localCount.goalDate)}</p>}
        <DurationCounter
          startDate={localCount.startDate}
          isCompleted={localCount.isCompleted}
          completedDate={localCount.completedDate}
        />
        <p>
          セーブ時間/月:{' '}
          {localCount.saveTimePerMonth ? `${localCount.saveTimePerMonth}分` : '未設定'}
        </p>
        <p>
          セーブ金額/月:{' '}
          {localCount.saveMoneyPerMonth
            ? `${localCount.saveMoneyPerMonth.toLocaleString()}円`
            : '未設定'}
        </p>
        <div className="mt-4">
          <p className="font-semibold">やめたい理由:</p>
          <p className="mt-1">
            {localCount.reason && localCount.reason.trim() ? localCount.reason : '未設定'}
          </p>
        </div>
        <div className="mt-4">
          <p className="font-semibold">決意表明:</p>
          <p className="mt-1">
            {localCount.commitment && localCount.commitment.trim()
              ? localCount.commitment
              : '未設定'}
          </p>
        </div>

        {/* If-Thenルール表示 */}
        <div className="mt-4">
          <p className="font-semibold">If-Then ルール:</p>
          {ifThenRules.length > 0 ? (
            <div className="mt-2 space-y-2">
              {ifThenRules.map((rule, index) => (
                <div key={rule.id} className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-2">ルール {index + 1}</div>
                  <div className="text-sm">
                    <div className="mb-1">
                      <span className="font-medium text-blue-600">もし:</span>{' '}
                      <span className="text-gray-700">{rule.ifCondition}</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">そうしたら:</span>{' '}
                      <span className="text-gray-700">{rule.thenAction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-gray-500">未設定</p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {/* 達成ボタン（完了していないかつ、ゴール日が設定されている場合のみ） */}
          {!localCount.isCompleted && localCount.goalDate && (
            <button
              className="w-full px-4 py-3 bg-green-500 text-white rounded font-medium hover:bg-green-600 transition-colors"
              onClick={() => setIsCompleteModalOpen(true)}
            >
              🎯 目標達成！
            </button>
          )}

          {/* 編集・削除ボタン */}
          <div className="flex gap-3">
            <button
              className={`flex-1 px-4 py-2 rounded transition-colors ${
                localCount.isCompleted
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={() => !localCount.isCompleted && setIsEditing(true)}
              disabled={localCount.isCompleted}
            >
              編集
            </button>
            <button
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              削除
            </button>
          </div>
        </div>

        {/* 削除確認モーダル */}
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="カウントの削除"
          message="このカウントを削除してもよろしいですか？"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />

        {/* 完了確認モーダル */}
        <ConfirmModal
          isOpen={isCompleteModalOpen}
          title="目標達成の確認"
          message="このカウントを達成済みにしますか？一度達成にすると元に戻せません。"
          confirmButtonStyle="success"
          onConfirm={handleComplete}
          onCancel={() => setIsCompleteModalOpen(false)}
        />
      </div>
    );
  } else {
    return (
      <CountForm
        initialValues={{
          title: localCount.title,
          startDate: new Date(localCount.startDate).toISOString().slice(0, 10),
          goalDate: localCount.goalDate
            ? new Date(localCount.goalDate).toISOString().slice(0, 10)
            : undefined,
          saveTimePerMonth: localCount.saveTimePerMonth ?? undefined,
          saveMoneyPerMonth: localCount.saveMoneyPerMonth ?? undefined,
          reason: localCount.reason ?? undefined,
          commitment: localCount.commitment ?? undefined,
          ifThenRules: ifThenRules.map((rule) => ({
            ifCondition: rule.ifCondition,
            thenAction: rule.thenAction,
          })),
        }}
        onSubmit={handleSubmit}
        loading={loading}
      />
    );
  }
}
