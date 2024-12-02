'use client';

import { withAdminAuth } from "@/components/auth/withAdminAuth";


function UsersPage() {
  return <div>UsersPage</div>;
}

export default withAdminAuth(UsersPage);