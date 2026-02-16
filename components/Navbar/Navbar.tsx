"use client";

import { Clock8 } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useUser } from "@/lib/firebase/auth-context";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, loading } = useUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          {!loading && user && (
            <li>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Log out
              </button>
            </li>
          )}
          <li>
            <Link href="/heists/create" className="btn">
              Create Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
