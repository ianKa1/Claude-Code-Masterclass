"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import AuthLoader from "@/components/ui/AuthLoader";

export default function PublicRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!loading && user && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/heists");
    }
  }, [user, loading, router]);

  if (loading) return <AuthLoader />;
  if (user) return <AuthLoader />;

  return <>{children}</>;
}
