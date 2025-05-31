import { NavButton } from '@/components/NavButton';
import { PageTitle } from '@/components/PageTitle';

export default function HomePage() {
  return (
    <>
      <PageTitle>ホーム</PageTitle>
      <p className="mt-8 text-center mb-8">今日もコツコツ続けていきましょう！</p>
      <div className="flex justify-center mb-4">
        <NavButton href="/count/" label="カウント一覧" />
      </div>
    </>
  );
}
