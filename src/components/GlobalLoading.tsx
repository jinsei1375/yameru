'use client';

import { useUI } from '@/contexts/UIContext';
import { LoadingOverlay } from './LoadingSpinner';

export function GlobalLoading() {
  const { isLoading } = useUI();

  if (!isLoading) return null;

  return <LoadingOverlay />;
}
