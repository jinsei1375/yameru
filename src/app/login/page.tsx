import GoogleSignInButton from '@/components/GooleSignInButton';
import { PageTitle } from '@/components/PageTitle';

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
