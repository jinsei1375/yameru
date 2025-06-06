'use client';

import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/interfaces/Badge';
import { Trophy } from 'lucide-react';
import { checkHomeBadges, getUserBadges } from '@/lib/badge';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

// ローカルストレージのキー
const BADGE_CHECK_KEY = 'last_badge_check_date';

// 今日の日付文字列を取得（日本時間）
function getTodayString(): string {
  const today = new Date();
  const jstToday = new Date(today.getTime() + 9 * 60 * 60 * 1000);
  return jstToday.toISOString().split('T')[0];
}

// 今日チェック済みかどうかを確認
function isCheckedToday(): boolean {
  if (typeof window === 'undefined') return false;
  const lastCheck = localStorage.getItem(BADGE_CHECK_KEY);
  return lastCheck === getTodayString();
}

// チェック日を更新
function updateCheckDate(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BADGE_CHECK_KEY, getTodayString());
}

export default function BadgeCollection() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);

  const fetchBadges = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // 今日まだチェックしていない場合のみバッジチェックを実行
      if (!isCheckedToday() && !hasCheckedToday) {
        console.log('バッジチェックを実行');
        await checkHomeBadges(user.id);
        updateCheckDate();
        setHasCheckedToday(true);
      }
      // バッジを取得
      const userBadges = await getUserBadges(user.id);
      setBadges(userBadges);
    } catch (error) {
      console.error('バッジの取得中にエラー:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, hasCheckedToday]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="text-yellow-500" size={20} />
        獲得バッジ
      </h3>

      {badges.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          まだバッジを獲得していません。継続してカウントを続けましょう！
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              {badge.iconUrl ? (
                <Image src={badge.iconUrl} alt={badge.name} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-2xl">🏆</span>
              )}
              <div>
                <h4 className="font-medium text-gray-900">{badge.name}</h4>
                <p className="text-sm text-gray-500">{badge.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  獲得日: {badge.createdAt.toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
