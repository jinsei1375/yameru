import GoogleSignInButton from '@/components/GooleSignInButton';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">Yameru にログイン</h1>
      <GoogleSignInButton />
    </div>
  );
}
