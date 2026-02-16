"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import { signUpUser } from "@/lib/firebase/signup";
import styles from "./Signup.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem("auth_email") ?? "")
      : "",
  );
  const [password, setPassword] = useState(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem("auth_password") ?? "")
      : "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firebaseError, setFirebaseError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    localStorage.setItem("auth_email", e.target.value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    localStorage.setItem("auth_password", value);
  };

  const handleEmailBlur = () => {
    if (email && !EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!valid) return;

    setFirebaseError("");
    setIsLoading(true);
    try {
      await signUpUser(email, password);
      setPassword("");
      localStorage.removeItem("auth_password");
      router.push("/heists");
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        setFirebaseError("Email is already registered");
      } else if (code === "auth/weak-password") {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setFirebaseError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Create an Account</h2>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          aria-label="Sign up form"
        >
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={styles.input}
              placeholder="you@example.com"
            />
            {emailError && <p className={styles.errorText}>{emailError}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <PasswordInput
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? <span className={styles.spinner} /> : "Sign Up"}
          </button>

          {firebaseError && <p className={styles.errorText}>{firebaseError}</p>}

          <SocialAuthButtons />

          <p className={styles.switchLink}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
