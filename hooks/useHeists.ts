import { useState, useEffect } from "react";
import { useUser } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Heist, heistConverter } from "@/types/firestore/heist";
import { COLLECTIONS } from "@/types/firestore";

type HeistFilter = "active" | "assigned" | "expired";

interface UseHeistsReturn {
  heists: Heist[];
  loading: boolean;
  error: Error | null;
}

export function useHeists(filter: HeistFilter): UseHeistsReturn {
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Handle unauthenticated users for 'active' and 'assigned' filters
    if (!user?.uid && (filter === "active" || filter === "assigned")) {
      setHeists([]);
      setLoading(false);
      return;
    }

    // Build the Firestore query with converter
    const heistsRef = collection(db, COLLECTIONS.HEISTS).withConverter(
      heistConverter,
    );

    // Construct query based on filter type
    let q;
    switch (filter) {
      case "active":
        // Heists assigned TO current user that are active
        q = query(
          heistsRef,
          where("createdFor", "==", user!.uid),
          where("isActive", "==", true),
        );
        break;

      case "assigned":
        // Heists created BY current user that are active
        q = query(
          heistsRef,
          where("createdBy", "==", user!.uid),
          where("isActive", "==", true),
        );
        break;

      case "expired":
        // All inactive heists (no user filter)
        q = query(heistsRef, where("isActive", "==", false));
        break;
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const heistsList = snapshot.docs.map((doc) => doc.data());
        setHeists(heistsList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
        setHeists([]);
      },
    );

    // Cleanup function
    return () => unsubscribe();
  }, [filter, user?.uid]);

  return { heists, loading, error };
}
