'use client';
import { useRouter } from 'next/navigation';
import { useUI } from '@/contexts/UIContext';

type NavButtonProps = {
  href: string;
  label: string;
  className?: string;
};

export function NavButton({ href, label, className = '' }: NavButtonProps) {
  const router = useRouter();
  const { setLoading: setGlobalLoading } = useUI();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setGlobalLoading(true);
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${className}`}
    >
      {label}
    </button>
  );
}
