"use client";

import DashboardNavbar from "../components/DashboardNavbar";
import { SearchProfileForm } from "../components/SearchProfileForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SearchSettingsPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNavbar isGuest={false} onLogout={handleLogout} />
      <main className="max-w-xl mx-auto px-6 pt-28 pb-10">
        <h1 className="text-xl font-semibold mb-1">Your search</h1>
        <p className="text-sm text-secondary mb-6">
          Job Radar runs once a day using the title and location below.
        </p>
        <SearchProfileForm />
      </main>
    </div>
  );
}
