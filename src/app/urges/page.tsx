import { PageTitle } from '@/components/PageTitle';
import { createClient } from '@/lib/supabase/server';
import { UrgeLog, toUrgeLog } from '@/interfaces/UrgeLog';
import { toCount } from '@/interfaces/Count';
import { formatJSTDateTime } from '@/lib/dateUtils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getUrgeLogsData() {
  const supabase = await createClient();

  try {
    // まずユーザーのカウントを取得（middleware認証により、ユーザーは認証済み）
    const { data: countsData, error: countsError } = await supabase
      .from('count_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (countsError) throw countsError;

    const fetchedCounts = countsData.map(toCount);

    // ユーザーのカウントIDのリストを作成
    const userCountIds = fetchedCounts.map((count) => count.id);

    let urgeLogs: UrgeLog[] = [];

    if (userCountIds.length > 0) {
      // ユーザーのカウントに関連するurgeLogsを取得
      const { data: urgeLogsData, error: urgeLogsError } = await supabase
        .from('urge_logs')
        .select('*')
        .in('count_id', userCountIds)
        .order('occurred_at', { ascending: false });

      if (urgeLogsError) throw urgeLogsError;

      urgeLogs = urgeLogsData.map(toUrgeLog);
    }

    return { urgeLogs, counts: fetchedCounts };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { urgeLogs: [], counts: [] };
  }
}

export default async function UrgesPage() {
  const { urgeLogs, counts } = await getUrgeLogsData();

  const getCountTitle = (countId: string) => {
    const count = counts.find((c) => c.id === countId);
    return count?.title || '不明なカウント';
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <PageTitle>衝動ログ</PageTitle>
        <Link
          href="/urges/new"
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} />
          記録する
        </Link>
      </div>

      {urgeLogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">まだ衝動ログがありません</p>
          <Link href="/urges/new" className="bg-yellow-500 text-white px-6 py-3 rounded-lg">
            最初の衝動ログを記録する
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {urgeLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-400"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{getCountTitle(log.countId)}</h3>
                <span className="text-sm text-gray-500">{formatJSTDateTime(log.occurredAt)}</span>
              </div>

              <div className="mb-3">
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  衝動度: {log.intensity}/10
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <strong className="text-gray-700">きっかけ:</strong>
                  <p className="text-gray-600 mt-1">{log.trigger}</p>
                </div>

                <div>
                  <strong className="text-gray-700">そのときの思考:</strong>
                  <p className="text-gray-600 mt-1">{log.thought}</p>
                </div>

                <div>
                  <strong className="text-gray-700">とった行動:</strong>
                  <p className="text-gray-600 mt-1">{log.actionTaken}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
