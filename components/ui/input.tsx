import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("h-10 w-full rounded-xl border border-input bg-white/70 px-3 text-sm outline-none", className)}
      {...props}
    />
  );
}
