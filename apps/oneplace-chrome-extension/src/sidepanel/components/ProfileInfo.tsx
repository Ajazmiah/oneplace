import CopyButton from "./CopyButton";

export type Education = {
  school?: string;
  city?: string;
  country?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string; // "YYYY-MM"
  endDate?: string; // "YYYY-MM", expected graduation when `current`
  current?: boolean;
};

// Shape of the web app's profile model, as synced by ExtensionAuthSync (dates are ISO strings)
export type Profile = {
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  pronouns?: string;
  email?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  authorizedCountries?: string[];
  visaStatus?: string;
  visaExpiry?: string;
  requiresSponsorship?: string;
  willingToRelocate?: string;
  workModes?: string[];
  noticePeriod?: string;
  earliestStartDate?: string;
  travel?: string;
  education?: Education[];
} | null;

// Display labels for saved option values. Keep in sync with profileOptions.js in the web app
// (the extension can't import from it).
const LABELS: Record<string, Record<string, string>> = {
  visaStatus: {
    citizen: "Citizen",
    "permanent-resident": "Permanent resident",
    "work-visa": "Work visa",
    "student-visa": "Student visa",
    other: "Other",
  },
  yesNo: { yes: "Yes", no: "No", maybe: "Maybe" },
  workModes: { remote: "Remote", hybrid: "Hybrid", "on-site": "On-site" },
  noticePeriod: {
    immediately: "Immediately",
    "1-week": "1 week",
    "2-weeks": "2 weeks",
    "1-month": "1 month",
    "2-months": "2 months",
    "3-months-plus": "3+ months",
  },
  travel: { none: "No travel", "25": "Up to 25%", "50": "Up to 50%", "75-plus": "75% or more" },
};

const label = (group: string, value?: string) =>
  value ? (LABELS[group]?.[value] ?? value) : undefined;

// UTC so a saved date never shifts a day in the user's timezone
const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : undefined;

const formatMonth = (yyyyMm?: string) =>
  yyyyMm ? formatDate(`${yyyyMm}-01`)?.replace(/^\d+\s/, "") : undefined;

const join = (parts: (string | undefined)[], sep = ", ") =>
  parts.filter(Boolean).join(sep) || undefined;

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", gap: 16 },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#888",
  },
  rows: { display: "flex", flexDirection: "column", gap: 8 },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "8px 12px",
    border: "1px solid #eee",
    borderRadius: 8,
    fontSize: 13,
  },
  rowText: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  rowLabel: { fontSize: 11, color: "#888" },
  rowValue: {
    color: "#111",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  eduCard: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "8px 12px",
    border: "1px solid #eee",
    borderRadius: 8,
    fontSize: 13,
  },
  eduSchool: { color: "#111", fontWeight: 600 },
  eduMeta: { color: "#666", fontSize: 12 },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    fontSize: 13,
    color: "#999",
  },
  emptyButton: {
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "#0bbcaa",
    background: "transparent",
    border: "1px solid #0bbcaa",
    borderRadius: 8,
    cursor: "pointer",
  },
};

type Row = [string, string | undefined];

function Section({ title, rows }: { title: string; rows: Row[] }) {
  const filled = rows.filter((r): r is [string, string] => Boolean(r[1]));
  if (filled.length === 0) return null;

  return (
    <div>
      <p style={s.sectionTitle}>{title}</p>
      <div style={s.rows}>
        {filled.map(([name, value]) => (
          <div key={name} style={s.row}>
            <div style={s.rowText}>
              <span style={s.rowLabel}>{name}</span>
              <span style={s.rowValue} title={value}>
                {value}
              </span>
            </div>
            <CopyButton text={value} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ entries }: { entries: Education[] }) {
  const filled = entries.filter((e) => e.school || e.degree);
  if (filled.length === 0) return null;

  return (
    <div>
      <p style={s.sectionTitle}>Education</p>
      <div style={s.rows}>
        {filled.map((e, i) => {
          const end = e.current
            ? e.endDate
              ? `Expected ${formatMonth(e.endDate)}`
              : "Present"
            : formatMonth(e.endDate);
          return (
            <div key={`${e.school}-${i}`} style={s.eduCard}>
              {e.school && <span style={s.eduSchool}>{e.school}</span>}
              {join([e.degree, e.fieldOfStudy], " · ") && (
                <span>{join([e.degree, e.fieldOfStudy], " · ")}</span>
              )}
              {join([formatMonth(e.startDate), end], " – ") && (
                <span style={s.eduMeta}>{join([formatMonth(e.startDate), end], " – ")}</span>
              )}
              {join([e.city, e.country]) && (
                <span style={s.eduMeta}>{join([e.city, e.country])}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfileInfo({
  profile,
  settingsUrl,
}: {
  profile: Profile;
  settingsUrl: string;
}) {
  if (!profile) {
    return (
      <div>
        <p style={s.sectionTitle}>Profile</p>
        <div style={s.empty}>
          <span>No profile saved yet.</span>
          <button
            type="button"
            style={s.emptyButton}
            onClick={() => chrome.tabs.create({ url: settingsUrl })}
          >
            Add your details
          </button>
        </div>
      </div>
    );
  }

  const p = profile;

  return (
    <div style={s.wrap}>
      <Section
        title="Personal"
        rows={[
          ["First name", p.firstName],
          ["Last name", p.lastName],
          ["Preferred name", p.preferredName],
          ["Pronouns", p.pronouns],
          ["Email", p.email],
          ["Phone", join([p.phoneCountryCode, p.phoneNumber], " ")],
          ["City", p.city],
          ["Country", p.country],
        ]}
      />
      <Section
        title="Work authorization"
        rows={[
          ["Authorized to work in", p.authorizedCountries?.join(", ")],
          ["Visa status", label("visaStatus", p.visaStatus)],
          ["Requires sponsorship", label("yesNo", p.requiresSponsorship)],
          ["Visa expiry", formatDate(p.visaExpiry)],
        ]}
      />
      <Section
        title="Preferences"
        rows={[
          ["Willing to relocate", label("yesNo", p.willingToRelocate)],
          ["Work mode", p.workModes?.map((m) => label("workModes", m)).join(", ")],
          ["Notice period", label("noticePeriod", p.noticePeriod)],
          ["Earliest start date", formatDate(p.earliestStartDate)],
          ["Travel", label("travel", p.travel)],
        ]}
      />
      {p.education && <EducationSection entries={p.education} />}
    </div>
  );
}
