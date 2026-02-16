import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "./config";
import { generateCodename } from "@/lib/utils/codename";

export async function signUpUser(
  email: string,
  password: string,
): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const codename = generateCodename();

  try {
    await updateProfile(user, { displayName: codename });
  } catch (err) {
    console.error("Failed to set displayName:", err);
  }

  try {
    await setDoc(doc(db, "users", user.uid), { id: user.uid, codename });
  } catch (err) {
    console.error("Failed to write users doc:", err);
  }
}
