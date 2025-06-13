'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function CTASection() {
  const { user } = useAuth();
  const buttonText = user ? 'ホームへ' : 'はじめてみる';
  const buttonLink = user ? '/home' : '/login';

  return (
    <div className="text-center">
      <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
        さあ、始めましょう
      </div>
      <div className="space-y-6">
        <p className="text-gray-600 leading-relaxed">
          あなたの「やめたい」を、
          <br />
          確かな「やめられる」に変えていく旅が、
          <br />
          ここから始まります。
        </p>
        <Link
          href={buttonLink}
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {buttonText}
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
