'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="text-center pt-0">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        やめることを、
        <br />
        あなたの強みに
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        タバコ、お酒、SNS、ゲーム...
        <br />
        やめたいと思っていても、なかなか続かない。
        <br />
        それは、あなたの意志が弱いからではありません。
      </p>
      <Link
        href={user ? '/home' : '/login'}
        className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {user ? 'ホームへ' : 'はじめてみる'}
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
  );
}
