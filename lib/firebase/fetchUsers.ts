import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";
import type { UserDoc } from "@/types/firestore/user";

export async function fetchUsers(): Promise<UserDoc[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    codename: doc.data().codename,
  }));
}
