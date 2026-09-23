import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes } from "react";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-20 w-full rounded-xl border border-input bg-white/70 px-3 py-2 text-sm outline-none", className)}
      {...props}
    />
  );
}
