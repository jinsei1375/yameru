'use client';

import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { InfoModal } from '@/components/InfoModal';

type InfoButtonProps = {
  title: string;
  content: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function InfoButton({ title, content, size = 'sm', className = '' }: InfoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-5 h-5';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className={`inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors ml-1 align-middle ${className}`}
        aria-label="詳細情報を表示"
      >
        <HelpCircle className={getSizeClasses()} />
      </button>

      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        content={content}
      />
    </>
  );
}
