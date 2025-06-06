import { Badge as BadgeType } from '@/interfaces/Badge';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
  badge: BadgeType;
  isAwarded: boolean;
};

export function Badge({ badge, isAwarded }: Props) {
  const [awardedAt, setAwardedAt] = useState<Date | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAwardedAt = async () => {
      if (!user || !isAwarded) return;

      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('user_badges')
          .select('awarded_at')
          .eq('user_id', user.id)
          .eq('badge_id', badge.id)
          .single();

        if (data?.awarded_at) {
          setAwardedAt(new Date(data.awarded_at));
        }
      } catch (error) {
        console.error('バッジの獲得日時の取得に失敗:', error);
      }
    };

    fetchAwardedAt();
  }, [badge.id, isAwarded, user]);

  return (
    <div
      className={`relative p-4 rounded-lg border ${
        isAwarded ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {badge.iconUrl ? (
            <img src={badge.iconUrl} alt={badge.name} className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900">{badge.name}</h3>
          {badge.description && <p className="text-sm text-gray-500">{badge.description}</p>}
          {isAwarded && awardedAt && (
            <p className="text-xs text-gray-400 mt-1">
              獲得日: {awardedAt.toLocaleDateString('ja-JP')}
            </p>
          )}
        </div>
      </div>
      {isAwarded && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            獲得済み
          </span>
        </div>
      )}
    </div>
  );
}
