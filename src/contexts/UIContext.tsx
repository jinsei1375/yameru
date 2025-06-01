'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

type Props = {
  children: ReactNode;
};

type NotificationType = 'success' | 'error' | 'info';

type Notification = {
  message: string;
  type?: NotificationType;
} | null;

type UIContextType = {
  isUserMenuOpen: boolean;
  openUserMenu: () => void;
  closeUserMenu: () => void;
  notification: Notification;
  showNotification: (message: string, type?: NotificationType) => void;
  clearNotification: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider = ({ children }: Props) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [notification, setNotification] = useState<Notification>(null);
  const [isLoading, setLoading] = useState(false);

  const openUserMenu = () => setUserMenuOpen(true);
  const closeUserMenu = () => setUserMenuOpen(false);

  const showNotification = (message: string, type: NotificationType = 'info') =>
    setNotification({ message, type });

  const clearNotification = () => setNotification(null);

  return (
    <UIContext.Provider
      value={{
        isUserMenuOpen,
        openUserMenu,
        closeUserMenu,
        notification,
        showNotification,
        clearNotification,
        isLoading,
        setLoading,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
