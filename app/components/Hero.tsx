import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl " />
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-primary">
            AI-powered job search
          </div>
          <h1 className="mt-8 text-5xl font-bold leading-tight text-foreground lg:text-6xl">
            {" "}
            Get the interviews.
            <br />
            <span className="text-primary">Not endless applications</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-secondary">
            Discover personalized job matches every morning, ranked by AI,
            complete with a recuirter contacts and a dashboard to stay organized
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Start Free{" "}
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-8 text-sm text-secondary">
            <div>✓ AI-ranked matches</div>
            <div>✓ Recruiter contacts</div>
            <div>✓ Daily updates</div>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-300" />
              <div className="h-3 w-3 rounded-full bg-yellow-300" />
              <div className="h-3 w-3 rounded-full bg-success" />
            </div>

            <div className="space-y-4">
              {[
                ["Netflix", "96% Match"],
                ["Spotify", "93% Match"],
                ["Disney", "90% Match"],
              ].map(([company, score]) => (
                <div
                  key={company}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition hover:border-primary"
                >
                  <div>
                    <p className="font-semibold text-foreground">{company}</p>

                    <p className="mt-1 text-sm text-secondary">
                      Senior Frontend Engineer
                    </p>
                  </div>

                  <div className="rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
                    {score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
