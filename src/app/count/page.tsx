import Link from 'next/link';

export default function SettingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">カウント</h1>
      <p className="mb-4">あなたが作成したカウントの一覧です。</p>
      <Link
        href="/count/new"
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        新しいカウントを作成
      </Link>
    </div>
  );
}
