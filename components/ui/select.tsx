import type { ReactNode, SelectHTMLAttributes } from "react";

export function Select({
  children,
  onValueChange,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { onValueChange?: (v: string) => void }) {
  return (
    <select
      {...props}
      onChange={(e) => {
        props.onChange?.(e);
        onValueChange?.(e.target.value);
      }}
      className="h-9 w-full rounded-lg border px-2 text-sm"
    >
      {children}
    </select>
  );
}
export const SelectTrigger = ({ children }: { children?: ReactNode }) => <>{children}</>;
export const SelectContent = ({ children }: { children?: ReactNode }) => <>{children}</>;
export const SelectItem = ({ value, children }: { value: string; children?: ReactNode }) => (
  <option value={value}>{children}</option>
);
export const SelectValue = () => null;
