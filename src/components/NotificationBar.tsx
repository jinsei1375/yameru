'use client';
import { useEffect } from 'react';
import { useUI } from '@/contexts/UIContext';

export const NotificationBar = () => {
  const { notification, clearNotification } = useUI();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 3000); // 3秒で自動的に消える
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const { message, type } = notification;

  const baseStyle =
    'fixed top-0 left-0 w-full h-12 flex items-center justify-center text-m text-white z-50';
  const bgColor =
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-700';

  return <div className={`${baseStyle} ${bgColor}`}>{message}</div>;
};
