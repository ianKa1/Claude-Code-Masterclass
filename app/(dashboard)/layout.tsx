"use client";

import Navbar from "@/components/Navbar";
import ProtectedRouteGuard from "@/components/guards/ProtectedRouteGuard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRouteGuard>
      <Navbar />
      <main>{children}</main>
    </ProtectedRouteGuard>
  );
}
