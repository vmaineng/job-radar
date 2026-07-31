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
    <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4">
      <a href="#top" className="text-2xl tracking-wide">
        Job Radar
      </a>
      <nav className="hidden items-center gap-6 md:flex">
        <ul className="flex items-center gap-8">
          {NAV_ITEMS.map((navlink) => (
            <li key={navlink.label}>
              <a href={navlink.href} className="relative font-medium">
                {navlink.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-4 md:hidden">
        <button className="text-2xl" onClick={() => setOpen(!open)}>
          {open ? "x" : "="}
        </button>
      </div>

      {open && (
        <div>
          <nav className="absolute top-full left-0 w-full shadow-sm md:hidden">
            <ul className="flex flex-col items-center gap-4 py-4">
              {NAV_ITEMS.map((navlink) => (
                <li key={navlink.label}>
                  <a
                    href={navlink.href}
                    className="relative font-medium"
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
  );
}
