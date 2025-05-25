'use client';

import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoutButton from './LogoutBtn';

export function MenuModal() {
  const { isUserMenuOpen, closeUserMenu } = useUI();
  const { user } = useAuth();

  return (
    <AnimatePresence>
      {isUserMenuOpen && (
        <Dialog
          open={isUserMenuOpen}
          onClose={closeUserMenu}
          className="fixed inset-0 z-50 flex items-center justify-center p-[5%]"
          // p-[5%]で上下左右5%ずつpaddingを確保
        >
          {/* 背景の半透明オーバーレイ */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={closeUserMenu} />

          {/* モーダル本体 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-full overflow-auto p-6"
            onClick={(e) => e.stopPropagation()} // 背景クリックで閉じるのを防止
            style={{
              minHeight: '50vh',
              height: 'calc(100vh - 10%)',
            }}
          >
            <DialogTitle className="text-lg font-bold mb-4">ユーザーメニュー</DialogTitle>
            <p className="mb-4">こんにちは、{user?.user_metadata?.name}さん</p>
            <LogoutButton />
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
