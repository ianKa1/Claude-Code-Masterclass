import styles from "./Select.module.css";

type SelectProps = {
  name: string;
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
};

export default function Select({
  name,
  label,
  required = false,
  value,
  onChange,
  children,
}: SelectProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className={styles.select}
      >
        {children}
      </select>
    </div>
  );
}
