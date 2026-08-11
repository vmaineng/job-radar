"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Moon,
  Sun,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

const NAV_LINKS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  { label: "Matches", href: "/dashboard/matches", icon: Search },
  { label: "Saved", href: "/dashboard/saved", icon: Bookmark },
];

interface DashboardNavbarProps {
  userName?: string;
  activeHref?: string;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
}

export default function DashboardNavbar({
  userName = "Mai",
  activeHref = "/dashboard",
  onNavigate,
  onLogout,
}: DashboardNavbarProps) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7l mx-auato flex items-center justify-between px-6 py-4">
        <Link
          href="/dashboard"
          className="text-2xl font-bold tracking-tight text-primary"
        >
          Job Radar
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  className="flex items-center gap-2 text-secondary font-medium transition-colors hover:text-primary"
                >
                  <Icon size={16} strokeWidth={2} />
                  {label}
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
          </div>
        </div>
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
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className=" block
                    px-6
                    py-3
                    text-secondary
                    hover:text-primary
                    hover:bg-card
                    transition-all"
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {label}
                  </a>
                </li>
              ))}

              <li className="mt-4 border-t border-border pt-4 px-6">
                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout?.();
                  }}
                  className="flex w-full items-center gap-2 py-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <LogOut size={15} className="text-secondary" />
                  Log out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </nav>
  );
}
