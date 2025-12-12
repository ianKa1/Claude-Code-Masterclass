"use client";

import { Clock8, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useUser } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="site-nav">
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className="logo" size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          {user && (
            <li>
              <button onClick={handleLogout} className="btn-muted">
                <LogOut size={20} />
                Log Out
              </button>
            </li>
          )}
          <li>
            <Link href="/heists/create" className="btn">
              <Plus size={20} />
              Create New Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
