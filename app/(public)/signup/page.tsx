"use client";

import { useState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import styles from "./Signup.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
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

    setIsLoading(true);
    console.log({ email, password });
    setIsLoading(false);
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

          <SocialAuthButtons />

          <p className={styles.switchLink}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
