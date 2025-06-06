import { Badge } from '@/interfaces/Badge';
import { Trophy } from 'lucide-react';

interface BadgeCollectionProps {
  badges: Badge[];
}

export default function BadgeCollection({ badges }: BadgeCollectionProps) {
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
                <img src={badge.iconUrl} alt={badge.name} className="w-8 h-8 object-contain" />
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
