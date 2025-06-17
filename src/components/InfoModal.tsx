'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type InfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

export function InfoModal({ isOpen, onClose, title, content }: InfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogPanel className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                {/* バツボタン - 右上に絶対配置 */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="閉じる"
                >
                  <X size={20} />
                </button>

                {/* タイトル */}
                <div className="mb-4 pr-8">
                  <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
                </div>

                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {content}
                </div>

                {/* 閉じるボタン - 中央配置 */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    閉じる
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
