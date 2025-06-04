'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Plus, Trash2 } from 'lucide-react';

const ifThenRuleSchema = z.object({
  ifCondition: z.string().min(1, 'IF条件は必須です'),
  thenAction: z.string().min(1, 'THEN行動は必須です'),
});

const countFormSchema = z
  .object({
    title: z.string().min(1, 'カウント名は必須です'),
    startDate: z.string().min(1, '開始日は必須です'),
    goalDate: z.string().min(1, 'ゴール日は必須です'),
    saveTimePerMonth: z
      .string()
      .optional()
      .refine((val) => val === '' || !isNaN(Number(val)), '数値で入力してください'),
    saveMoneyPerMonth: z
      .string()
      .optional()
      .refine((val) => val === '' || !isNaN(Number(val)), '数値で入力してください'),
    reason: z.string().optional(),
    commitment: z.string().optional(),
    ifThenRules: z.array(ifThenRuleSchema),
  })
  .refine(
    (data) => {
      // ゴール日が開始日より後であることを確認
      const startDate = new Date(data.startDate);
      const goalDate = new Date(data.goalDate);
      return goalDate >= startDate;
    },
    {
      message: 'ゴール日は開始日以降の日付を選択してください',
      path: ['goalDate'], // エラーを表示するフィールド
    }
  )
  .refine(
    (data) => {
      // saveTimePerMonthまたはsaveMoneyPerMonthのどちらかが入力されていることを確認
      const hasTimeValue = data.saveTimePerMonth && data.saveTimePerMonth.trim() !== '';
      const hasMoneyValue = data.saveMoneyPerMonth && data.saveMoneyPerMonth.trim() !== '';
      return hasTimeValue || hasMoneyValue;
    },
    {
      message: '節約時間または節約金額のどちらか一方は入力してください',
      path: ['saveTimePerMonth'], // エラーを表示するフィールド（どちらでも良いので時間の方に表示）
    }
  );

type CountFormValues = z.infer<typeof countFormSchema>;

type CountFormProps = {
  initialValues?: {
    title?: string;
    startDate?: string;
    goalDate?: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
    reason?: string;
    commitment?: string;
    ifThenRules?: Array<{
      ifCondition: string;
      thenAction: string;
    }>;
  };
  onSubmit: (values: {
    title: string;
    startDate: string;
    goalDate: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
    reason?: string;
    commitment?: string;
    ifThenRules: Array<{
      ifCondition: string;
      thenAction: string;
    }>;
  }) => Promise<void>;
  loading?: boolean;
};

export function CountForm({ initialValues, onSubmit, loading }: CountFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CountFormValues>({
    resolver: zodResolver(countFormSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      startDate: initialValues?.startDate ?? '',
      goalDate: initialValues?.goalDate ?? '',
      saveTimePerMonth: initialValues?.saveTimePerMonth?.toString() ?? '',
      saveMoneyPerMonth: initialValues?.saveMoneyPerMonth?.toString() ?? '',
      reason: initialValues?.reason ?? '',
      commitment: initialValues?.commitment ?? '',
      ifThenRules: initialValues?.ifThenRules ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ifThenRules',
  });

  const onValid = async (data: CountFormValues) => {
    await onSubmit({
      title: data.title,
      startDate: data.startDate,
      goalDate: data.goalDate,
      saveTimePerMonth: data.saveTimePerMonth ? Number(data.saveTimePerMonth) : undefined,
      saveMoneyPerMonth: data.saveMoneyPerMonth ? Number(data.saveMoneyPerMonth) : undefined,
      reason: data.reason,
      commitment: data.commitment,
      ifThenRules: data.ifThenRules,
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid as any)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">カウント名</label>
        <input {...register('title')} className="w-full border rounded p-2 text-gray-900" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">開始日</label>
        <input
          type="date"
          {...register('startDate')}
          className="w-full border rounded p-2 text-gray-900"
        />
        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">ゴール日</label>
        <input
          type="date"
          {...register('goalDate')}
          className="w-full border rounded p-2 text-gray-900"
        />
        {errors.goalDate && <p className="text-red-500 text-sm">{errors.goalDate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">1ヶ月でセーブする時間（分）</label>
        <input
          type="number"
          {...register('saveTimePerMonth')}
          className="w-full border rounded p-2 text-gray-900"
          placeholder="例: 60"
        />
        {errors.saveTimePerMonth && (
          <p className="text-red-500 text-sm">{errors.saveTimePerMonth.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">1ヶ月でセーブする金額（円）</label>
        <input
          type="number"
          {...register('saveMoneyPerMonth')}
          className="w-full border rounded p-2 text-gray-900"
          placeholder="例: 5000"
        />
        {errors.saveMoneyPerMonth && (
          <p className="text-red-500 text-sm">{errors.saveMoneyPerMonth.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          ※ 節約時間または節約金額のどちらか一方は必ず入力してください
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">やめたい理由</label>
        <textarea
          {...register('reason')}
          className="w-full border rounded p-2 text-gray-900 h-24 resize-none"
          placeholder="例: 健康のため、時間を有効活用したいため..."
        />
        {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">決意表明</label>
        <textarea
          {...register('commitment')}
          className="w-full border rounded p-2 text-gray-900 h-24 resize-none"
          placeholder="例: 絶対にやめて新しい自分になる、家族のために頑張る..."
        />
        {errors.commitment && <p className="text-red-500 text-sm">{errors.commitment.message}</p>}
      </div>

      {/* If-Then ルールセクション */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">If-Then ルール</label>
          <button
            type="button"
            onClick={() => append({ ifCondition: '', thenAction: '' })}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" />
            追加
          </button>
        </div>
        <p className="text-xs text-gray-500">
          やめたくなった時の対処法を「もし〜なら、〜する」の形で設定できます
        </p>

        {fields.map((field, index) => (
          <div key={field.id} className="border border-gray-200 rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">ルール {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">IF（条件）</label>
              <input
                {...register(`ifThenRules.${index}.ifCondition`)}
                className="w-full border rounded p-2 text-gray-900 text-sm"
                placeholder="例: スマホを見たくなったら"
              />
              {errors.ifThenRules?.[index]?.ifCondition && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ifThenRules[index]?.ifCondition?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">THEN（行動）</label>
              <input
                {...register(`ifThenRules.${index}.thenAction`)}
                className="w-full border rounded p-2 text-gray-900 text-sm"
                placeholder="例: 深呼吸を3回する"
              />
              {errors.ifThenRules?.[index]?.thenAction && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ifThenRules[index]?.thenAction?.message}
                </p>
              )}
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded">
            <p className="text-sm">まだIf-Thenルールが設定されていません</p>
            <p className="text-xs mt-1">「追加」ボタンから設定できます</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded font-bold"
          onClick={() => window.history.back()}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              <span className="ml-2">保存中...</span>
            </>
          ) : (
            '保存'
          )}
        </button>
      </div>
    </form>
  );
}
