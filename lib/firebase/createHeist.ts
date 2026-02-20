import { addDoc, collection } from "firebase/firestore";
import { db } from "./config";
import type { CreateHeistInput } from "@/types/firestore/heist";

export async function createHeist(input: CreateHeistInput): Promise<string> {
  const docRef = await addDoc(collection(db, "heists"), input);
  return docRef.id;
}
