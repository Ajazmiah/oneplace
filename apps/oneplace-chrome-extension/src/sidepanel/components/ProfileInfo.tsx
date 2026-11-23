import CopyButton from "./CopyButton";
import { GraduationIcon, SettingsIcon, UserIcon } from "./Icons";

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

// "2016-09" → "Sep 2016"
const formatMonth = (yyyyMm?: string) =>
  yyyyMm
    ? new Date(`${yyyyMm}-01`).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : undefined;

const join = (parts: (string | undefined)[], sep = ", ") =>
  parts.filter(Boolean).join(sep) || undefined;

type Row = [string, string | undefined];

function Section({ title, rows }: { title: string; rows: Row[] }) {
  const filled = rows.filter((r): r is [string, string] => Boolean(r[1]));
  if (filled.length === 0) return null;

  return (
    <section className="card" aria-label={title}>
      <div className="card-header">
        <span className="section-pill">{title}</span>
      </div>
      <div className="rows">
        {filled.map(([name, value]) => (
          <div key={name} className="row">
            <div className="row-text">
              <span className="row-label">{name}</span>
              <span className="row-value" title={value}>
                {value}
              </span>
            </div>
            <CopyButton text={value} label={`Copy ${name.toLowerCase()}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ entries }: { entries: Education[] }) {
  const filled = entries.filter((e) => e.school || e.degree);
  if (filled.length === 0) return null;

  return (
    <section className="card" aria-label="Education">
      <div className="card-header">
        <span className="section-pill">Education</span>
      </div>
      {filled.map((e, i) => {
        const end = e.current
          ? e.endDate
            ? `Expected ${formatMonth(e.endDate)}`
            : "Present"
          : formatMonth(e.endDate);
        const study = join([e.degree, e.fieldOfStudy], " · ");
        const dates = join([formatMonth(e.startDate), end], " – ");
        const place = join([e.city, e.country]);
        return (
          <div key={`${e.school}-${i}`} className="row">
            <span className="row-icon">
              <GraduationIcon size={15} />
            </span>
            <div className="row-text">
              {e.school && <span className="sub-title">{e.school}</span>}
              {study && <span className="row-value">{study}</span>}
              {(dates || place) && (
                <span className="sub-meta">{join([dates, place], " · ")}</span>
              )}
            </div>
            {e.school && <CopyButton text={e.school} label="Copy school name" />}
          </div>
        );
      })}
    </section>
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
      <section className="card">
        <div className="empty">
          <span className="empty-icon">
            <UserIcon size={18} />
          </span>
          <span>No profile saved yet. Add your details once and copy them into any form.</span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => chrome.tabs.create({ url: settingsUrl })}
          >
            <SettingsIcon size={15} />
            Add your details
          </button>
        </div>
      </section>
    );
  }

  const p = profile;

  return (
    <>
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
    </>
  );
}
