import { useCallback } from 'react';
import { MessageCircle, Share2 } from 'lucide-react';

const getShareUrl = (service: 'line' | 'x', text: string, url: string) => {
  if (service === 'line') {
    return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
  }
  if (service === 'x') {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
  }
  return '#';
};

export function SnsShareButtons({ text, url }: { text: string; url: string }) {
  const handleShare = useCallback(
    (service: 'line' | 'x') => {
      const shareUrl = getShareUrl(service, text, url);
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    },
    [text, url]
  );

  return (
    <div className="flex gap-2 mt-2">
      <button
        type="button"
        onClick={() => handleShare('line')}
        className="flex items-center gap-1 px-3 py-1 bg-green-400 text-white rounded hover:bg-green-500 transition-colors text-sm"
        aria-label="LINEでシェア"
      >
        <MessageCircle className="w-4 h-4" />
        LINE
      </button>
      <button
        type="button"
        onClick={() => handleShare('x')}
        className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
        aria-label="Xでシェア"
      >
        <Share2 className="w-4 h-4" />X
      </button>
    </div>
  );
}
