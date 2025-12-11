"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { generateCodename } from "@/lib/codename";
import { updateUserProfile, getAuthErrorMessage } from "@/lib/auth";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import styles from "./AuthForm.module.css";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const isLogin = mode === "login";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (isLogin) {
      setIsLoading(true);

      try {
        // Sign in with Firebase
        await signInWithEmailAndPassword(auth, email, password);

        // Navigate to /heists
        router.push("/heists");
      } catch (err) {
        setError(getAuthErrorMessage(err));
        setIsLoading(false);
      }

      return;
    }

    // SIGNUP FLOW
    setIsLoading(true);

    try {
      // 1. Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // 2. Generate codename
      const codename = generateCodename();

      // 3. Update profile with retry
      await updateUserProfile(userCredential.user, codename);

      // 4. Navigate to /heists
      router.push("/heists");
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordInput
        name="password"
        label="Password"
        placeholder="Enter your password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {!isLogin && (
        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading
          ? isLogin
            ? "Logging in..."
            : "Signing up..."
          : isLogin
            ? "Log In"
            : "Sign Up"}
      </button>

      <p className={styles.switchLink}>
        {isLogin ? (
          <>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </>
        ) : (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        )}
      </p>
    </form>
  );
}
