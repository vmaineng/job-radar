"use client";

import { Sparkles, Users, Search, ClipboardList } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Ranking",
    text: "Every job is scored against your resume so you focus on the best opportunities first.",
  },
  {
    icon: Search,
    title: "Daily Matches",
    text: "Receive fresh job recommendations every morning tailored to your profile.",
  },
  {
    icon: Users,
    title: "Recruiter Contacts",
    text: "Discover the people behind the hiring process and connect faster.",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    text: "Stay organized with one place to manage every application and interview.",
  },
];

export default function Features() {
  return (
    <section className="bg-background py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>

          <h2 className="mt-4 text-4xl font-bold text-foreground md:text-5xl">
            Everything you need to
            <span className="text-primary"> find your next role</span>
          </h2>

          <p className="mt-6 text-lg text-secondary">
            Job Radar brings together AI-powered job discovery and application
            tracking in one clean dashboard.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-surface p-8
                shadow-sm transition-all duration-300 hover:-translate-y-2
                hover:border-primary hover:shadow-lg"
              >
                <div
                  className="
                    mb-6
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-xl
                    bg-card
                    transition-colors
                    group-hover:bg-primary/10
                  "
                >
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-4 leading-7 text-secondary">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
