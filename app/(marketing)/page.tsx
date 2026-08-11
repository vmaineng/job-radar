"use client";

import MarketingNavbar from "./MarketingNavbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNavbar />
      <Hero />
      <Features />
    </div>
  );
}
