// 1. フロント用型（キャメルケース、Date型など）
export type Count = {
  id: string;
  userId: string;
  title: string;
  startDate: Date;
  goalDate: Date;
  saveTimePerMonth?: number;
  saveMoneyPerMonth?: number;
};

// 2. DB用型（スネークケース、日付はstring型で表現することも多い）
export type DbCount = {
  id: string;
  user_id: string;
  title: string;
  start_date: string; // ISO8601文字列
  goal_date: string;
  save_time_per_month?: number;
  save_money_per_month?: number;
};

// 3. 変換関数（フロント→DB）
export function toDbCount(count: Omit<Count, 'id'>): Omit<DbCount, 'id'> {
  return {
    user_id: count.userId,
    title: count.title,
    start_date: count.startDate.toISOString(),
    goal_date: count.goalDate.toISOString(),
    save_time_per_month: count.saveTimePerMonth,
    save_money_per_month: count.saveMoneyPerMonth,
  };
}

// 4. 変換関数（DB→フロント）
export function toCount(dbCount: DbCount): Count {
  return {
    id: dbCount.id,
    userId: dbCount.user_id,
    title: dbCount.title,
    startDate: new Date(dbCount.start_date),
    goalDate: new Date(dbCount.goal_date),
    saveTimePerMonth: dbCount.save_time_per_month,
    saveMoneyPerMonth: dbCount.save_money_per_month,
  };
}

export type DbCountInsert = Omit<
  {
    id: string;
    user_id: string;
    title: string;
    start_date: string; // ISO文字列
    goal_date: string;
    save_time_per_month?: number;
    save_money_per_month?: number;
  },
  'id'
>;

// 変換関数も用意しておく
export function toDbCountInsert(count: Omit<Count, 'id'>): DbCountInsert {
  return {
    user_id: count.userId,
    title: count.title,
    start_date: count.startDate.toISOString(),
    goal_date: count.goalDate.toISOString(),
    save_time_per_month: count.saveTimePerMonth,
    save_money_per_month: count.saveMoneyPerMonth,
  };
}
