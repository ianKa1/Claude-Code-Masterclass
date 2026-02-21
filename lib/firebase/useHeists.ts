"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "./config";
import { useUser } from "./auth-context";
import { heistConverter, type Heist } from "@/types/firestore/heist";

type HeistFilter = "active" | "assigned" | "expired";

interface UseHeistsReturn {
  heists: Heist[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHeists(filter: HeistFilter): UseHeistsReturn {
  const { user, loading: authLoading } = useUser();
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Guard: wait for auth to load
    if (authLoading) {
      return;
    }

    // No authenticated user
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Resetting state when auth completes with no user
      setHeists([]);
       
      setLoading(false);
       
      setError(null);
      return;
    }

     
    setLoading(true);
     
    setError(null);

    // Build query based on filter type
    const heistsRef = collection(db, "heists").withConverter(heistConverter);
    let q;

    const now = Timestamp.now();

    if (filter === "active") {
      // Heists assigned TO current user, deadline in future
      q = query(
        heistsRef,
        where("assignedTo", "==", user.uid),
        where("deadline", ">", now),
        orderBy("deadline", "asc"),
        limit(50),
      );
    } else if (filter === "assigned") {
      // Heists created BY current user, deadline in future
      q = query(
        heistsRef,
        where("createdBy", "==", user.uid),
        where("deadline", ">", now),
        orderBy("deadline", "asc"),
        limit(50),
      );
    } else {
      // Expired heists (all users, past deadline, most recent first)
      q = query(
        heistsRef,
        where("deadline", "<=", now),
        orderBy("deadline", "desc"),
        limit(50),
      );
    }

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data() as Heist);
        setHeists(data);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error("Firestore query error:", err);
        setError("Failed to load heists. Please try again.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [filter, user, authLoading, refetchTrigger]);

  return { heists, loading, error, refetch };
}
