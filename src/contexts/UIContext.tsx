'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

type Props = {
  children: ReactNode;
};
type UIContextType = {
  isUserMenuOpen: boolean;
  openUserMenu: () => void;
  closeUserMenu: () => void;
};

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider = ({ children }: Props) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <UIContext.Provider
      value={{
        isUserMenuOpen,
        openUserMenu: () => setUserMenuOpen(true),
        closeUserMenu: () => setUserMenuOpen(false),
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
  return context; // null でないことを保証しているのでUIContextTypeだけ
};
