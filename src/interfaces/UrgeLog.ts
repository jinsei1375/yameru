// UrgeLogs.ts

// フロント用型（キャメルケース、Date型）
export interface UrgeLog {
  id: string;
  countId: string;
  intensity: number;
  trigger: string;
  thought: string;
  actionTaken: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// DB用型（スネークケース、文字列で日付）
export interface DbUrgeLog {
  id: string;
  count_id: string;
  intensity: number;
  trigger: string;
  thought: string;
  action_taken: string;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

// フロント → DB変換関数（新規挿入用）
export function toDbUrgeLogInsert(
  urgeLog: Omit<UrgeLog, 'id' | 'createdAt' | 'updatedAt'>
): DbUrgeLogInsert {
  return {
    count_id: urgeLog.countId,
    intensity: urgeLog.intensity,
    trigger: urgeLog.trigger,
    thought: urgeLog.thought,
    action_taken: urgeLog.actionTaken,
    occurred_at: urgeLog.occurredAt.toISOString(),
  };
}

// DB → フロント変換関数
export function toUrgeLog(dbUrgeLog: DbUrgeLog): UrgeLog {
  return {
    id: dbUrgeLog.id,
    countId: dbUrgeLog.count_id,
    intensity: dbUrgeLog.intensity,
    trigger: dbUrgeLog.trigger,
    thought: dbUrgeLog.thought,
    actionTaken: dbUrgeLog.action_taken,
    occurredAt: new Date(dbUrgeLog.occurred_at),
    createdAt: new Date(dbUrgeLog.created_at),
    updatedAt: new Date(dbUrgeLog.updated_at),
  };
}

// 挿入用型（created_at, updated_at はDB側で自動付与）
export interface DbUrgeLogInsert extends Omit<DbUrgeLog, 'id' | 'created_at' | 'updated_at'> {}
