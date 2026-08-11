"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-primary"
        >
          Job Radar
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map((navlink) => (
              <li key={navlink.label}>
                <a
                  href={navlink.href}
                  className="text-secondary
                    font-medium
                    transition-colors
                    hover:text-primary"
                >
                  {navlink.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-primary transition hover:bg-card"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <Link
              href="/login"
              className="text-secondary hover:text-primary transition-colors"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-hover transition"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-primary">
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <button
            className="text-2xl text-primary"
            onClick={() => setOpen(!open)}
          >
            {open ? "x" : "="}
          </button>
        </div>
      </div>

      {open && (
        <div>
          <nav
            className="md:hidden
            border-t
            border-border
            bg-surface"
          >
            <ul className="flex flex-col py-4">
              {NAV_ITEMS.map((navlink) => (
                <li key={navlink.label}>
                  <a
                    href={navlink.href}
                    className=" block
                    px-6
                    py-3
                    text-secondary
                    hover:text-primary
                    hover:bg-card
                    transition-all"
                    onClick={() => setOpen(false)}
                  >
                    {navlink.label}
                  </a>
                </li>
              ))}
              <li className="mt-4 border-t border-border pt-4 px-6">
                <Link
                  href="/login"
                  className="block py-3 text-secondary"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              </li>

              <li className="px-6">
                <Link
                  href="/signup"
                  className="mt-2 block rounded-xl bg-primary px-4 py-3 text-center font-medium text-white hover:bg-primary-hover"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
