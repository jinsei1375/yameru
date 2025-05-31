import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">「やめる」に挑戦しませんか？</h2>
      <Link href="/login">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-full shadow transition">
          はじめてみる
        </button>
      </Link>
    </section>
  );
}
