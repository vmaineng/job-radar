import Link from "next/link";

export function GuestBanner() {
  return (
    <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 flex items-center justify-between">
      <p className="text-sm text-foreground">
        You&apos;re viewing sample matches. Sign up to get real daily-scanned
        jobs with contacts.
      </p>
      <div className="flex gap-3 shrink-0 ml-4 items-center">
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:underline px-1"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="text-sm font-medium bg-primary text-primary px-3 py-1.5 rounded-lg hover:bg-primary-hover"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
