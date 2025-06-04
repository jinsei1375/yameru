// フロント用型（キャメルケース）
export interface IfThenRule {
  id: string;
  countItemId: string; // counts テーブルの id
  ifCondition: string; // 例: スマホを見たくなったら
  thenAction: string; // 例: 深呼吸をする
  createdAt: Date;
  updatedAt: Date;
}

// DB用型（スネークケース）
export interface DbIfThenRule {
  id: string;
  count_id: string;
  if_condition: string;
  then_action: string;
  created_at: string;
  updated_at: string;
}

// Insert用型
export type DbIfThenRuleInsert = Omit<DbIfThenRule, 'id' | 'created_at' | 'updated_at'>;

// フロント→DB Insert 変換関数
export function toDbIfThenRuleInsert(
  rule: Omit<IfThenRule, 'id' | 'createdAt' | 'updatedAt'>
): DbIfThenRuleInsert {
  return {
    count_id: rule.countItemId,
    if_condition: rule.ifCondition,
    then_action: rule.thenAction,
  };
}

// DB→フロント変換関数
export function toIfThenRule(db: DbIfThenRule): IfThenRule {
  return {
    id: db.id,
    countItemId: db.count_id,
    ifCondition: db.if_condition,
    thenAction: db.then_action,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}
