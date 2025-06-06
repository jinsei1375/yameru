// 1. フロント用型
export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

// 2. DB用型
export interface DbUserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

// 3. 変換関数（DB → フロント）
export function toUserBadge(dbUserBadge: DbUserBadge): UserBadge {
  return {
    id: dbUserBadge.id,
    userId: dbUserBadge.user_id,
    badgeId: dbUserBadge.badge_id,
    earnedAt: new Date(dbUserBadge.earned_at),
  };
}

// 4. 変換関数（フロント → DB）
export function toDbUserBadge(userBadge: Omit<UserBadge, 'id'>): Omit<DbUserBadge, 'id'> {
  return {
    user_id: userBadge.userId,
    badge_id: userBadge.badgeId,
    earned_at: userBadge.earnedAt.toISOString(),
  };
}

// 5. 挿入用型と変換関数
export interface DbUserBadgeInsert extends Omit<DbUserBadge, 'id'> {}

export function toDbUserBadgeInsert(userBadge: Omit<UserBadge, 'id'>): DbUserBadgeInsert {
  return toDbUserBadge(userBadge);
}
