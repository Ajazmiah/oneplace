import { cn } from "@/lib/utils";

// Each section gets its own muted accent (icon chip + left bar) so they're easy to tell apart.
// Full class names are written out so Tailwind can find them.
const ACCENTS = {
  brand: { bar: "before:bg-brand", chip: "bg-brand/10 text-brand-strong" },
  sky: { bar: "before:bg-sky-400", chip: "bg-sky-100 text-sky-700" },
  amber: { bar: "before:bg-amber-400", chip: "bg-amber-100 text-amber-700" },
  violet: { bar: "before:bg-violet-400", chip: "bg-violet-100 text-violet-700" },
};

export default function ProfileSection({ icon: Icon, title, description, accent = "brand", children }) {
  const { bar, chip } = ACCENTS[accent] ?? ACCENTS.brand;
  const headingId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8",
        "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:content-['']",
        bar
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", chip)}>
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <div>
          <h2 id={headingId} className="text-base font-semibold text-slate-900">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
        </div>
      </div>

      <div className="divider-brand my-6" />

      {children}
    </section>
  );
}
