"use client";
import { ReactNode } from "react";
import RadarSignature from "./RadarSignature";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center">
        <RadarSignature />
        <Link
          href="/"
          className="absolute top-6 left-6 z-10 text-sm font-semibold text-white/80 tracking-tight transition-opacity hover:opacity-100 hover:underline"
        >
          Job Radar
        </Link>

        <div className="relative z-10 px-12 text-center">
          <span className="text-3xl font-semibold text-white tracking-tight">
            Job Radar
          </span>
          <p className="mt-3 text-white/70 max-w-xs mx-auto text-sm leading-relaxed">
            Scanning the field daily so you show up with a match, a score, and a
            contact - not a cold application.
          </p>
        </div>
      </div>
      <div className="flex-1 relative flex items-center justify-center px-6 py-16">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 rounded-lg p-2 text-primary transition hover:bg-card"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <Link
              href="/"
              className="text-3xl font-semibold text-white tracking-tight transition-opacity hover:opacity-80"
            >
              Job Radar
            </Link>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-secondary mt-1 text-sm">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
