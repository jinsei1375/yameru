'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Count } from '@/interfaces/Count';
import { getNowJST } from '@/lib/dateUtils';

const urgeLogFormSchema = z.object({
  countId: z.string().min(1, 'カウントを選択してください'),
  intensity: z
    .number()
    .min(1, '衝動度は1以上で入力してください')
    .max(10, '衝動度は10以下で入力してください'),
  trigger: z.string().min(1, 'きっかけを入力してください'),
  thought: z.string().min(1, 'そのときの思考を入力してください'),
  actionTaken: z.string().min(1, 'とった行動を入力してください'),
  isPastUrge: z.boolean(),
  occurredAt: z.string().min(1, '発生日時を入力してください'),
});

type UrgeLogFormValues = z.infer<typeof urgeLogFormSchema>;

type UrgeLogFormProps = {
  counts: Count[];
  onSubmit: (values: {
    countId: string;
    intensity: number;
    trigger: string;
    thought: string;
    actionTaken: string;
    occurredAt: Date;
  }) => Promise<void>;
  loading?: boolean;
};

export function UrgeLogForm({ counts, onSubmit, loading }: UrgeLogFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UrgeLogFormValues>({
    resolver: zodResolver(urgeLogFormSchema),
    defaultValues: {
      countId: counts.length > 0 ? counts[0].id : '',
      intensity: 5,
      trigger: '',
      thought: '',
      actionTaken: '',
      isPastUrge: false,
      occurredAt: (() => {
        const now = getNowJST();
        return now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM形式
      })(),
    },
  });

  const isPastUrge = watch('isPastUrge');
  const intensity = watch('intensity');

  const onValid = async (data: UrgeLogFormValues) => {
    await onSubmit({
      countId: data.countId,
      intensity: data.intensity,
      trigger: data.trigger.trim(),
      thought: data.thought.trim(),
      actionTaken: data.actionTaken.trim(),
      occurredAt: data.isPastUrge ? new Date(data.occurredAt) : getNowJST(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      {/* カウント選択 */}
      <div>
        <label className="block text-sm font-medium">カウント</label>
        <select {...register('countId')} className="w-full border rounded p-2 text-gray-900">
          <option value="">カウントを選択してください</option>
          {counts.map((count) => (
            <option key={count.id} value={count.id}>
              {count.title}
            </option>
          ))}
        </select>
        {errors.countId && <p className="text-red-500 text-sm">{errors.countId.message}</p>}
      </div>

      {/* 衝動度 */}
      <div>
        <label className="block text-sm font-medium">衝動度 ({intensity}/10)</label>
        <input
          type="range"
          min="1"
          max="10"
          {...register('intensity', { valueAsNumber: true })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>弱い (1)</span>
          <span>強い (10)</span>
        </div>
        {errors.intensity && <p className="text-red-500 text-sm">{errors.intensity.message}</p>}
      </div>

      {/* 過去の衝動記録フラグ */}
      <div>
        <label className="flex items-center">
          <input type="checkbox" {...register('isPastUrge')} className="mr-2" />
          <span className="text-sm">過去の衝動を記録する</span>
        </label>
      </div>

      {/* 日時選択（過去の衝動の場合のみ表示） */}
      {isPastUrge && (
        <div>
          <label className="block text-sm font-medium">発生日時</label>
          <input
            type="datetime-local"
            {...register('occurredAt')}
            className="w-full border rounded p-2 text-gray-900"
          />
          {errors.occurredAt && <p className="text-red-500 text-sm">{errors.occurredAt.message}</p>}
        </div>
      )}

      {/* きっかけ */}
      <div>
        <label className="block text-sm font-medium">きっかけ</label>
        <textarea
          {...register('trigger')}
          placeholder="何がきっかけで衝動を感じましたか？"
          className="w-full border rounded p-2 text-gray-900 h-24 resize-none"
        />
        {errors.trigger && <p className="text-red-500 text-sm">{errors.trigger.message}</p>}
      </div>

      {/* そのときの思考 */}
      <div>
        <label className="block text-sm font-medium">そのときの思考</label>
        <textarea
          {...register('thought')}
          placeholder="どんなことを考えていましたか？"
          className="w-full border rounded p-2 text-gray-900 h-24 resize-none"
        />
        {errors.thought && <p className="text-red-500 text-sm">{errors.thought.message}</p>}
      </div>

      {/* とった行動 */}
      <div>
        <label className="block text-sm font-medium">とった行動</label>
        <textarea
          {...register('actionTaken')}
          placeholder="実際にどんな行動をとりましたか？"
          className="w-full border rounded p-2 text-gray-900 h-24 resize-none"
        />
        {errors.actionTaken && <p className="text-red-500 text-sm">{errors.actionTaken.message}</p>}
      </div>

      {/* ボタン */}
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
              <span className="ml-2">記録中...</span>
            </>
          ) : (
            '記録する'
          )}
        </button>
      </div>
    </form>
  );
}
