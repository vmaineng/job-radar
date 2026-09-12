type Preset = { key: string; label: string };

interface DemoRunFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  preset: string;
  onPresetChange: (preset: string) => void;
  presets: Preset[];
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
}

export function DemoRunForm({
  email,
  onEmailChange,
  preset,
  onPresetChange,
  presets,
  loading,
  error,
  onSubmit,
}: DemoRunFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4 border rounded-lg p-6 bg-card shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-border rounded-md px-3 py-2 bg-surface text-foreground placeholder:text-secondary"
          disabled={loading}
          required
        />
        <p className="text-xs text-secondary mt-1">
          One demo run per email — no spam, promise.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">
          Search
        </label>
        <select
          value={preset}
          onChange={(e) => onPresetChange(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2 bg-surface text-foreground"
          disabled={loading}
        >
          {presets.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full bg-primary hover:bg-primary-hover text-primary rounded-md py-2 font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? "Running agent..." : "Run Agent"}
      </button>
    </form>
  );
}
