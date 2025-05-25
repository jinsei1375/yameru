'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import LogoutBtn from '@/components/LogoutBtn';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient(); // クライアント用
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <div>ようこそ、{user.email}さん！</div>
    </>
  );
}
