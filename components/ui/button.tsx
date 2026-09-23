import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | string;
  size?: "default" | "sm" | "lg" | "icon" | string;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "bg-transparent hover:bg-muted text-foreground",
    outline: "border border-input bg-transparent hover:bg-muted text-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  }[variant] ?? "bg-primary text-primary-foreground";

  const sizeStyles = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
    icon: "h-9 w-9 p-0",
  }[size] ?? "px-4 py-2 text-sm";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-50",
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    />
  );
}
