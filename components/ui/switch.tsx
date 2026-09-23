"use client";

export function Switch({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`h-6 w-11 rounded-full transition ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`block h-5 w-5 rounded-full bg-white shadow translate-y-0.5 transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}
