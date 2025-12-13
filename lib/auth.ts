import { updateProfile } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Maps Firebase Auth error codes to user-friendly error messages.
 * @param error - The error object from Firebase Auth
 * @returns A user-friendly error message
 */
export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: string }).code;

    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Try logging in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-credential":
        return "Invalid email or password. Please try again.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  return "Something went wrong. Please try again.";
}

/**
 * Updates a user's profile with retry logic and exponential backoff.
 * @param user - The Firebase user object
 * @param displayName - The display name to set
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @throws Error if all retry attempts fail
 */
export async function updateUserProfile(
  user: User,
  displayName: string,
  maxRetries: number = 3,
): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await updateProfile(user, { displayName });
      return; // Success
    } catch (error) {
      lastError = error;

      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries - 1) {
        const delay = 500 * Math.pow(2, attempt); // 500ms, 1000ms, 2000ms
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  throw new Error(
    `Failed to update profile after ${maxRetries} attempts: ${lastError instanceof Error ? lastError.message : "Unknown error"}`,
  );
}

/**
 * Creates a user document in Firestore with the user's codename.
 * @param userId - The Firebase Auth user UID
 * @param codename - The user's generated codename
 * @throws Error if the document creation fails
 */
export async function createUserDocument(
  userId: string,
  codename: string,
): Promise<void> {
  try {
    console.log(
      "Creating user document for:",
      userId,
      "with codename:",
      codename,
    );
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      codename,
    });
    console.log("Successfully created user document");
  } catch (error) {
    console.error("Error creating user document:", error);
    throw new Error(
      `Failed to create user document: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
