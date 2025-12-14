import styles from "./Textarea.module.css";

type TextareaProps = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
};

export default function Textarea({
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  rows = 4,
}: TextareaProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        rows={rows}
        className={styles.textarea}
      />
    </div>
  );
}
