'use client';

import { Loader2 } from 'lucide-react';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  message?: string;
};

export function LoadingSpinner({ size = 'md', color = 'blue', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    blue: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-500',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}

// グローバルローディングオーバーレイ
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-hidden">
      <div className="p-4 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </div>
  );
}
