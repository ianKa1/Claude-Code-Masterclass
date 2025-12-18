import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Heist, heistConverter } from "@/types/firestore/heist";
import { COLLECTIONS } from "@/types/firestore";

interface UseHeistReturn {
  heist: Heist | null;
  loading: boolean;
  error: Error | null;
  notFound: boolean;
}

/**
 * Real-time Firestore hook for fetching a single heist by ID.
 *
 * @param heistId - The Firestore document ID of the heist
 * @returns Object containing:
 *   - heist: The heist data (null while loading or on error)
 *   - loading: true during initial fetch, false once resolved
 *   - error: Error object if Firestore request fails (null otherwise)
 *   - notFound: true if heistId is empty or document doesn't exist
 *
 * State combinations:
 *   - Initial: { loading: true, heist: null, error: null, notFound: false }
 *   - Success: { loading: false, heist: Heist, error: null, notFound: false }
 *   - Not Found: { loading: false, heist: null, error: null, notFound: true }
 *   - Error: { loading: false, heist: null, error: Error, notFound: false }
 *
 * Note: Subscribes to real-time updates via onSnapshot
 */
export function useHeist(heistId: string): UseHeistReturn {
  const isValidId = heistId && heistId.trim().length > 0;

  const [heist, setHeist] = useState<Heist | null>(null);
  const [loading, setLoading] = useState(isValidId);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(!isValidId);

  useEffect(() => {
    if (!isValidId) {
      return;
    }

    const heistRef = doc(db, COLLECTIONS.HEISTS, heistId).withConverter(
      heistConverter,
    );

    const unsubscribe = onSnapshot(
      heistRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setHeist(snapshot.data());
          setNotFound(false);
          setError(null);
        } else {
          setHeist(null);
          setNotFound(true);
          setError(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
        setHeist(null);
        setNotFound(false);
      },
    );

    return () => unsubscribe();
  }, [heistId, isValidId]);

  return { heist, loading, error, notFound };
}
