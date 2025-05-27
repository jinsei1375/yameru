'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PageTitle } from '@/components/PageTitle';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
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
      <PageTitle>ホーム</PageTitle>
    </>
  );
}
