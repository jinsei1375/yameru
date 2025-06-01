'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const countFormSchema = z.object({
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
});

type CountFormValues = z.infer<typeof countFormSchema>;

type CountFormProps = {
  initialValues?: {
    title: string;
    startDate: string;
    goalDate: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
  };
  onSubmit: (values: {
    title: string;
    startDate: string;
    goalDate: string;
    saveTimePerMonth?: number;
    saveMoneyPerMonth?: number;
  }) => Promise<void>;
  loading?: boolean;
};

export function CountForm({ initialValues, onSubmit, loading }: CountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CountFormValues>({
    resolver: zodResolver(countFormSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      startDate: initialValues?.startDate ?? '',
      goalDate: initialValues?.goalDate ?? '',
      saveTimePerMonth: initialValues?.saveTimePerMonth?.toString() ?? '',
      saveMoneyPerMonth: initialValues?.saveMoneyPerMonth?.toString() ?? '',
    },
  });

  const onValid = async (data: CountFormValues) => {
    await onSubmit({
      title: data.title,
      startDate: data.startDate,
      goalDate: data.goalDate,
      saveTimePerMonth: data.saveTimePerMonth ? Number(data.saveTimePerMonth) : undefined,
      saveMoneyPerMonth: data.saveMoneyPerMonth ? Number(data.saveMoneyPerMonth) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
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
        />
        {errors.saveMoneyPerMonth && (
          <p className="text-red-500 text-sm">{errors.saveMoneyPerMonth.message}</p>
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
