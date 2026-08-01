"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="ax-w-6xl mx-auto px-6 pt-28 pb-10">
        <Hero />
      </main>
    </div>
  );
}
