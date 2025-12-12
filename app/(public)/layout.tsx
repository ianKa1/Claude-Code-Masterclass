"use client";

import PublicRouteGuard from "@/components/guards/PublicRouteGuard";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicRouteGuard>
      <div className="public">
        <main>{children}</main>
      </div>
    </PublicRouteGuard>
  );
}
