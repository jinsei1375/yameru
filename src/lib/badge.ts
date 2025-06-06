import { createClient } from './supabase/client';
import { Badge, DbBadge, toBadge } from '@/interfaces/Badge';

// ユーザーのバッジ一覧を取得
export async function getUserBadges(userId: string): Promise<Badge[]> {
  try {
    const supabase = createClient();
    const { data: userBadges, error } = await supabase
      .from('user_badges')
      .select(
        `
        badge_id,
        badges:badge_id (
          id,
          name,
          description,
          days_required,
          icon_url,
          created_at
        )
      `
      )
      .eq('user_id', userId);

    if (error) {
      console.error('バッジの取得に失敗:', error);
      return [];
    }

    return userBadges
      .filter((ub) => ub.badges !== null)
      .map((ub) => toBadge(ub.badges as unknown as DbBadge));
  } catch (error) {
    console.error('バッジの取得中にエラー:', error);
    return [];
  }
}

// ユーザーのストリーク日数に基づいてバッジをチェックし、条件を満たすものを付与
export async function checkAndAwardBadges(userId: string, streakDays: number): Promise<void> {
  try {
    const supabase = createClient();

    // 条件を満たすバッジを取得
    const { data: eligibleBadges, error: badgesError } = await supabase
      .from('badges')
      .select('*')
      .lte('days_required', streakDays);

    if (badgesError) {
      console.error('バッジの取得に失敗:', badgesError);
      return;
    }

    if (!eligibleBadges || eligibleBadges.length === 0) {
      return;
    }

    // 既に獲得しているバッジを取得
    const { data: existingBadges, error: existingError } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);

    if (existingError) {
      console.error('既存バッジの取得に失敗:', existingError);
      return;
    }

    const existingBadgeIds = existingBadges?.map((b) => b.badge_id) || [];

    // 新しいバッジを付与
    const newBadges = eligibleBadges.filter((badge) => !existingBadgeIds.includes(badge.id));
    if (newBadges.length > 0) {
      const { error: insertError } = await supabase.from('user_badges').insert(
        newBadges.map((badge) => ({
          user_id: userId,
          badge_id: badge.id,
          awarded_at: new Date().toISOString(),
        }))
      );

      if (insertError) {
        console.error('バッジの付与に失敗:', insertError);
      }
    }
  } catch (error) {
    console.error('バッジのチェック中にエラー:', error);
  }
}

// バッジの獲得状態を確認
export async function checkBadgeStatus(userId: string, badgeId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // バッジが存在しない場合
        return false;
      }
      console.error('バッジの状態確認に失敗:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('バッジの状態確認中にエラー:', error);
    return false;
  }
}
