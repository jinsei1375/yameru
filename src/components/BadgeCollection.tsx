import { Badge as BadgeType } from '@/interfaces/Badge';
import { Badge } from './Badge';

interface BadgeCollectionProps {
  badges: BadgeType[];
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({ badges }) => {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        まだバッジを獲得していません。継続してカウントを続けましょう！
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <Badge key={badge.id} badge={badge} isAwarded={true} />
      ))}
    </div>
  );
};
