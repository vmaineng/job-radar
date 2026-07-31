"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Profile", href: "#profile" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="text-2xl font-bold tracking-tight text-primary"
        >
          Job Radar
        </a>
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
        </nav>

        <div
          className="md:hidden
            text-2xl
            text-primary"
        >
          <button className="text-2xl" onClick={() => setOpen(!open)}>
            {open ? "x" : "="}
          </button>
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
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
