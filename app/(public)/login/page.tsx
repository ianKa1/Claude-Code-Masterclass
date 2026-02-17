"use client";

import { useState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import { loginUser } from "@/lib/firebase/login";
import styles from "./Login.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
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
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const displayName = await loginUser(email, password);
      setSuccessMessage(`Welcome back, ${displayName ?? "Agent"}!`);
      setPassword("");
      localStorage.removeItem("auth_password");
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/invalid-credential") {
        setFirebaseError("Invalid email or password");
      } else if (code === "auth/user-disabled") {
        setFirebaseError("This account has been disabled");
      } else if (code === "auth/too-many-requests") {
        setFirebaseError("Too many attempts. Please try again later");
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
        <h2 className="form-title">Log In to Your Account</h2>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          aria-label="Log in form"
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
            <a href="#" className={styles.forgotLink}>
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? <span className={styles.spinner} /> : "Log In"}
          </button>

          {firebaseError && <p className={styles.errorText}>{firebaseError}</p>}
          {successMessage && (
            <p className={styles.successText}>{successMessage}</p>
          )}

          <SocialAuthButtons />

          <p className={styles.switchLink}>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
