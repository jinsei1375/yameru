'use client';

import { ArrowsUpFromLine } from 'lucide-react';

export default function LineShareButton() {
  const text = encodeURIComponent('やめたい行動を記録できるアプリ「Yameru」がおすすめ！');
  const url = encodeURIComponent('https://yameru.vercel.app'); // 本番URLに置き換えてください
  const lineShareUrl = `https://line.me/R/msg/text/?${text}%0A${url}`;

  return (
    <a
      href={lineShareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition"
    >
      <ArrowsUpFromLine className="w-5 h-5 mr-2" />
      LINEでシェア
    </a>
  );
}
