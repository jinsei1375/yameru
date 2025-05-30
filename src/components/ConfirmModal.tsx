// components/ConfirmModal.tsx
'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fragment } from 'react';

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title = '確認',
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      <Dialog open={isOpen} onClose={onCancel} as={Fragment}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
        >
          <DialogPanel className="bg-white p-6 rounded shadow-md w-80">
            <DialogTitle className="text-lg font-bold text-center text-gray-900">
              {title}
            </DialogTitle>
            <p className="mt-2 text-gray-900">{message}</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-400 rounded w-full max-w-[120px]"
              >
                キャンセル
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded w-full max-w-[120px]"
              >
                OK
              </button>
            </div>
          </DialogPanel>
        </motion.div>
      </Dialog>
    </AnimatePresence>
  );
}
