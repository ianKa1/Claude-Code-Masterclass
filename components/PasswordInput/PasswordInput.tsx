"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./PasswordInput.module.css";

type Props = Readonly<{
  value: string;
  onChange: (value: string) => void;
  error?: string;
}>;

export default function PasswordInput({ value, onChange, error }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className={styles.toggleBtn}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
