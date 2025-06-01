'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useUI } from '@/contexts/UIContext';

type NavButtonProps = {
  href: string;
  label: string;
  className?: string;
};

export function NavButton({ href, label, className = '' }: NavButtonProps) {
  const router = useRouter();
  const { setLoading: setGlobalLoading } = useUI();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setGlobalLoading(true);

    // ページ遷移を実行
    router.push(href);

    // 少し遅延を入れてからローディングを解除（実際のページロードが完了するまで）
    setTimeout(() => {
      setIsNavigating(false);
      setGlobalLoading(false);
    }, 500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isNavigating}
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${className}`}
    >
      {isNavigating ? (
        <>
          <LoadingSpinner size="sm" color="white" />
          <span className="ml-2">読み込み中...</span>
        </>
      ) : (
        label
      )}
    </button>
  );
}
