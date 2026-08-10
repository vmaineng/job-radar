"use client";

import { InputHTMLAttributes } from "react";

export default function AuthInput({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
      />
    </label>
  );
}
