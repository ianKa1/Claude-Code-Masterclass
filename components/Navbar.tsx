"use client";

import { Clock8, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

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
          {isAuthenticated && (
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
