import GoogleSignInButton from '@/components/GooleSignInButton';
import { PageTitle } from '@/components/PageTitle';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginPage() {
  return (
    <>
      <PageTitle>ログイン</PageTitle>
      <div className="flex justify-center">
        <GoogleSignInButton />
      </div>
    </>
  );
}
