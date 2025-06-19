import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export type SnsType = 'x';

export function SnsShareModal({
  isOpen,
  onClose,
  shareText,
}: {
  isOpen: boolean;
  onClose: () => void;
  shareText: string;
}) {
  const handleShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

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
              <DialogPanel className="bg-white rounded-lg shadow-xl w-full max-w-md min-w-[300px] sm:min-w-[400px] p-8 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="閉じる"
                >
                  <X size={20} />
                </button>
                <DialogTitle className="text-lg font-semibold text-gray-900 mb-4 flex justify-center items-center gap-2">
                  シェアする
                </DialogTitle>
                <div className="space-y-4">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors text-base"
                  >
                    Xでシェア
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
