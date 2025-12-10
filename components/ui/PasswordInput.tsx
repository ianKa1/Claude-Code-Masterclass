"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./PasswordInput.module.css";
import inputStyles from "./Input.module.css";

type PasswordInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordInput({
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={inputStyles.field}>
      <label htmlFor={name} className={inputStyles.label}>
        {label}
      </label>
      <div className={styles.wrapper}>
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={`${inputStyles.input} ${styles.input}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={styles.toggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
