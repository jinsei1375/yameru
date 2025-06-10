import { IfThenRule } from './IfThenRule';

// 1. フロント用型（キャメルケース、Date型など）
export interface Count {
  id: string;
  userId: string;
  title: string;
  startDate: Date;
  goalDate?: Date;
  saveTimePerMonth?: number;
  saveMoneyPerMonth?: number;
  reason?: string; // やめたい理由
  commitment?: string; // 決意表明
  ifThenRules?: IfThenRule[]; // If-Then ルール
  isCompleted: boolean;
  completedDate?: Date; // 完了日時
}

// 2. DB用型（スネークケース、日付はISO8601文字列）
export interface DbCount {
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  goal_date?: string | null;
  save_time_per_month?: number | null;
  save_money_per_month?: number | null;
  reason?: string | null;
  commitment?: string | null;
  is_completed: boolean; // 完了フラグ
  completed_date?: string | null; // 完了日時
}

// 3. 変換関数（フロント→DB）
export function toDbCount(count: Omit<Count, 'id'>): Omit<DbCount, 'id'> {
  return {
    user_id: count.userId,
    title: count.title,
    start_date: count.startDate.toISOString(),
    goal_date: count.goalDate?.toISOString() ?? null,
    save_time_per_month: count.saveTimePerMonth,
    save_money_per_month: count.saveMoneyPerMonth,
    reason: count.reason,
    commitment: count.commitment,
    is_completed: false,
  };
}

// 4. 変換関数（DB→フロント）
export function toCount(dbCount: DbCount): Count {
  return {
    id: dbCount.id,
    userId: dbCount.user_id,
    title: dbCount.title,
    startDate: new Date(dbCount.start_date),
    goalDate: dbCount.goal_date ? new Date(dbCount.goal_date) : undefined,
    saveTimePerMonth: dbCount.save_time_per_month ?? undefined,
    saveMoneyPerMonth: dbCount.save_money_per_month ?? undefined,
    reason: dbCount.reason ?? undefined,
    commitment: dbCount.commitment ?? undefined,
    isCompleted: dbCount.is_completed,
    completedDate: dbCount.completed_date ? new Date(dbCount.completed_date) : undefined,
  };
}

// 5. 挿入用型と変換関数
export interface DbCountInsert extends Omit<DbCount, 'id'> {}

export function toDbCountInsert(count: Omit<Count, 'id'>): DbCountInsert {
  return {
    user_id: count.userId,
    title: count.title,
    start_date: count.startDate.toISOString(),
    goal_date: count.goalDate?.toISOString() ?? null,
    save_time_per_month: count.saveTimePerMonth,
    save_money_per_month: count.saveMoneyPerMonth,
    reason: count.reason,
    commitment: count.commitment,
    is_completed: false,
  };
}
