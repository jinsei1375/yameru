import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="text-center py-12 px-6 bg-gradient-to-b from-yellow-50 to-white">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
        「やめたい」を
        <br className="md:hidden" /> 続けられる力に
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
        ギャンブル。暴飲暴食。無駄遣い。
        <br />
        やめるのは難しい。けれど、やめられたら、人生は変わる。
        <br />
        <span className="font-medium text-gray-800 block mt-4">
          Yameruは、「やめたい」を応援する記録アプリです。
        </span>
      </p>
      <div className="mt-10">
        <Link
          href="/signup"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-full shadow transition"
        >
          はじめてみる
        </Link>
      </div>
    </section>
  );
}
