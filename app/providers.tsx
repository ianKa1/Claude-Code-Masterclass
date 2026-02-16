"use client";

import { AuthProvider } from "@/lib/firebase/auth-context";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthProvider>{children}</AuthProvider>;
}
