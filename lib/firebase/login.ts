import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config";

export async function loginUser(
  email: string,
  password: string,
): Promise<string | null> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user.displayName;
}
