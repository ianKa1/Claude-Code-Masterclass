import type { Metadata } from "next";

// components
import Navbar from "@/components/Navbar";

export default function HeistsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
