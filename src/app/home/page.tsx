import { createClient } from '@/lib/supabase/server';
import { toCount } from '@/interfaces/Count';
import MotivationSection from '@/components/home/MotivationSection';
import ActiveCountsCard from '@/components/home/ActiveCountsCard';
import WeeklyUrgeLogsCard from '@/components/home/WeeklyUrgeLogsCard';
import AchievementDisplay from '@/components/home/AchievementDisplay';
import BadgeCollection from '@/components/home/BadgeCollection';
import { redirect } from 'next/navigation';
import { SavingsSummary } from '@/components/home/SavingsSummary';

async function getHomeData() {
  const supabase = await createClient();

  try {
    // ユーザー情報を取得
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    // カウントデータを取得
    const { data: countsData, error: countsError } = await supabase
      .from('count_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (countsError) throw countsError;

    const counts = countsData.map(toCount);

    // 今週の開始日（月曜日）を計算
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);

    // 今週の衝動ログを取得
    const userCountIds = counts.map((count) => count.id);
    let weeklyUrgeLogs = [];

    if (userCountIds.length > 0) {
      const { data: urgeLogsData, error: urgeLogsError } = await supabase
        .from('urge_logs')
        .select('*')
        .in('count_id', userCountIds)
        .gte('occurred_at', weekStart.toISOString())
        .order('occurred_at', { ascending: false });

      if (urgeLogsError) throw urgeLogsError;

      weeklyUrgeLogs = urgeLogsData;
    }

    return {
      counts,
      weeklyUrgeLogsCount: weeklyUrgeLogs.length,
      weeklyUrgeLogs,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      counts: [],
      weeklyUrgeLogsCount: 0,
      weeklyUrgeLogs: [],
    };
  }
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // ホーム画面のデータを取得
  const { counts, weeklyUrgeLogsCount, weeklyUrgeLogs } = await getHomeData();

  return (
    <div className="container mx-auto px-4 py-8 pt-0 space-y-6">
      <SavingsSummary />
      <MotivationSection />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActiveCountsCard counts={counts} />
        <WeeklyUrgeLogsCard count={weeklyUrgeLogsCount} />
      </div>

      <AchievementDisplay counts={counts} weeklyUrgeLogs={weeklyUrgeLogs} />
      <BadgeCollection />
    </div>
  );
}
