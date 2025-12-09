import type { Metadata } from "next"
import "@/app/globals.css"

// components
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Pocket Heist",
  description: "Tiny missions. Big office mischief.",
}

export default function HeistsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
