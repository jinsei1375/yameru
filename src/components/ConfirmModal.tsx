'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonStyle?: 'danger' | 'success' | 'default';
};

export function ConfirmModal({
  isOpen,
  title = '確認',
  message,
  onConfirm,
  onCancel,
  confirmButtonStyle = 'danger',
}: ConfirmModalProps) {
  const getConfirmButtonClass = () => {
    switch (confirmButtonStyle) {
      case 'success':
        return 'px-4 py-2 bg-green-500 text-white rounded w-full max-w-[120px] hover:bg-green-600 transition-colors';
      case 'default':
        return 'px-4 py-2 bg-blue-500 text-white rounded w-full max-w-[120px] hover:bg-blue-600 transition-colors';
      case 'danger':
      default:
        return 'px-4 py-2 bg-red-500 text-white rounded w-full max-w-[120px] hover:bg-red-600 transition-colors';
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onCancel} className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogPanel className="bg-white p-6 rounded-lg shadow-xl w-80 max-w-sm">
                <DialogTitle className="text-lg font-bold text-center text-gray-900 mb-4">
                  {title}
                </DialogTitle>
                <p className="text-gray-700 text-center mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-400 text-white rounded w-full max-w-[120px] hover:bg-gray-500 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button onClick={onConfirm} className={getConfirmButtonClass()}>
                    OK
                  </button>
                </div>
              </DialogPanel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
