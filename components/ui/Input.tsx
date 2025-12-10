import styles from "./Input.module.css";

type InputProps = {
  type?: "text" | "email" | "password";
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  type = "text",
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
}: InputProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={styles.input}
      />
    </div>
  );
}
