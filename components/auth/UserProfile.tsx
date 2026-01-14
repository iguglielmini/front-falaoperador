'use client';

import { useSession } from '@/lib/auth-client';

export function UserProfile() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Carregando...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-foreground">
        {session.user.name}
      </span>
    </div>
  );
}
