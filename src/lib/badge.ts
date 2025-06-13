import { createClient as createClientClient } from './supabase/client';
import { Badge, DbBadge, toBadge } from '@/interfaces/Badge';

// クライアントサイド用の関数
export async function getUserBadges(userId: string): Promise<Badge[]> {
  try {
    const supabase = createClientClient();
    const { data: userBadges, error } = await supabase
      .from('user_badges')
      .select(
        `
        badge_id,
        earned_at,
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
      .map((ub) => ({
        ...toBadge(ub.badges as unknown as DbBadge),
        createdAt: new Date(ub.earned_at),
      }));
  } catch (error) {
    console.error('バッジの取得中にエラー:', error);
    return [];
  }
}

// ホーム画面でのバッジチェック（クライアントサイド用）
export async function checkHomeBadges(userId: string): Promise<void> {
  try {
    const supabase = createClientClient();

    // ユーザーのカウントを取得
    const { data: counts, error: countsError } = await supabase
      .from('count_items')
      .select('start_date')
      .eq('user_id', userId)
      .eq('is_completed', false);

    if (countsError) {
      console.error('カウントの取得に失敗:', countsError);
      return;
    }

    if (!counts || counts.length === 0) {
      return;
    }

    // 最も古いカウントの開始日から経過日数を計算
    const oldestStartDate = new Date(
      Math.min(...counts.map((c) => new Date(c.start_date).getTime()))
    );
    const streakDays = Math.floor(
      (new Date().getTime() - oldestStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 条件を満たすバッジを取得
    const { data: eligibleBadges } = await supabase
      .from('badges')
      .select('*')
      .lte('days_required', streakDays);

    if (!eligibleBadges || eligibleBadges.length === 0) {
      return;
    }

    // 既に獲得しているバッジを取得
    const { data: existingBadges } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);

    const existingBadgeIds = existingBadges?.map((b) => b.badge_id) || [];

    // 新しいバッジを付与
    const newBadges = eligibleBadges.filter((badge) => !existingBadgeIds.includes(badge.id));
    if (newBadges.length > 0) {
      await supabase.from('user_badges').insert(
        newBadges.map((badge) => ({
          user_id: userId,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
        }))
      );
    }
  } catch (error) {
    console.error('ホーム画面でのバッジチェック中にエラー:', error);
  }
}

// バッジの獲得状態を確認（クライアントサイド用）
export async function checkBadgeStatus(userId: string, badgeId: string): Promise<boolean> {
  try {
    const supabase = createClientClient();
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
