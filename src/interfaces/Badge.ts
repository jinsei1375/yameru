// 1. フロント用型（キャメルケース、Date型など）
export interface Badge {
  id: string;
  name: string;
  description?: string;
  daysRequired: number;
  iconUrl?: string;
  createdAt: Date;
}

// 2. DB用型（スネークケース、日付はISO8601文字列）
export interface DbBadge {
  id: string;
  name: string;
  description: string | null;
  days_required: number;
  icon_url: string | null;
  created_at: string;
}

// 3. 変換関数（DB → フロント）
export function toBadge(dbBadge: DbBadge): Badge {
  return {
    id: dbBadge.id,
    name: dbBadge.name,
    description: dbBadge.description ?? undefined,
    daysRequired: dbBadge.days_required,
    iconUrl: dbBadge.icon_url ?? undefined,
    createdAt: new Date(dbBadge.created_at),
  };
}

// 4. 変換関数（フロント → DB）
export function toDbBadge(badge: Omit<Badge, 'id'>): Omit<DbBadge, 'id'> {
  return {
    name: badge.name,
    description: badge.description ?? null,
    days_required: badge.daysRequired,
    icon_url: badge.iconUrl ?? null,
    created_at: badge.createdAt.toISOString(),
  };
}

// 5. 挿入用型と変換関数
export interface DbBadgeInsert extends Omit<DbBadge, 'id'> {}

export function toDbBadgeInsert(badge: Omit<Badge, 'id'>): DbBadgeInsert {
  return toDbBadge(badge);
}
