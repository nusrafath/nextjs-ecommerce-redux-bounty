'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

type RoleBasedAccessProps = {
  allowedRoles: ('ADMIN' | 'SELLER' | 'CUSTOMER')[];
  children: ReactNode;
};

export default function RoleBasedAccess({ allowedRoles, children }: RoleBasedAccessProps) {
  const { data: session } = useSession();

  if (session?.user?.role && allowedRoles.includes(session.user.role)) {
    return <>{children}</>;
  }

  return null;
}
