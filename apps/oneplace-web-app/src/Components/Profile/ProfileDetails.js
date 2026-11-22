// Read-only view of the autofill profile on /profile. Sections with saved data show as
// cards; empty ones show as "+ Add …" capsules. Both link to that section in Settings,
// which is the one place the profile is edited.
import { Plus, Pencil, User, BadgeCheck, SlidersHorizontal, GraduationCap } from "lucide-react";
import CopyButton from "@/Components/CopyButton/CopyButton";
import { cn } from "@/lib/utils";
import {
  VISA_STATUS,
  RELOCATE,
  WORK_MODES,
  NOTICE_PERIODS,
  TRAVEL,
  SECTION_IDS,
  labelOf,
} from "@/Components/Settings/ProfileForm/profileOptions";

// Plain <a>, not next/link: a full navigation sets the #hash as the CSS :target, which is
// what scrolls to and highlights the section in Settings.
const settingsHref = (sectionId) => `/dashboard/settings#${sectionId}`;

const ACCENT_CHIP = {
  brand: "bg-brand/10 text-brand-strong",
  sky: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
};

// "2027-05-01T00:00:00.000Z" → "May 1, 2027". UTC so the day doesn't shift by timezone.
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    : undefined;

// "2020-09" → "Sep 2020"
const formatMonth = (month) => {
  if (!month) return undefined;
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
};

const joinParts = (...parts) => parts.filter(Boolean).join(", ") || undefined;

const SPONSORSHIP = { yes: "Will need sponsorship", no: "No sponsorship needed" };

export default function ProfileDetails({ profile }) {
  const p = profile ?? {};

  const phone = [p.phoneCountryCode, p.phoneNumber].filter(Boolean).join(" ") || undefined;
  const legalName = [p.firstName, p.lastName].filter(Boolean).join(" ") || undefined;

  const sections = [
    {
      key: "personal",
      id: SECTION_IDS.personal,
      title: "Personal",
      icon: User,
      accent: "brand",
      rows: [
        { label: "Legal name", value: legalName, copy: true },
        { label: "Preferred name", value: p.preferredName },
        { label: "Pronouns", value: p.pronouns },
        { label: "Email", value: p.email, copy: true },
        { label: "Phone", value: phone, copy: true },
        { label: "Location", value: joinParts(p.city, p.country) },
      ],
    },
    {
      key: "workAuthorization",
      id: SECTION_IDS.workAuthorization,
      title: "Work authorization",
      icon: BadgeCheck,
      accent: "sky",
      rows: [
        { label: "Authorized to work in", chips: p.authorizedCountries },
        { label: "Status", value: p.visaStatus && labelOf(VISA_STATUS, p.visaStatus) },
        { label: "Sponsorship", value: SPONSORSHIP[p.requiresSponsorship] },
        { label: "Visa expiry", value: formatDate(p.visaExpiry) },
      ],
    },
    {
      key: "preferences",
      id: SECTION_IDS.preferences,
      title: "Preferences",
      icon: SlidersHorizontal,
      accent: "amber",
      rows: [
        {
          label: "Willing to relocate",
          value: p.willingToRelocate && labelOf(RELOCATE, p.willingToRelocate),
        },
        { label: "Work mode", chips: p.workModes?.map((m) => labelOf(WORK_MODES, m)) },
        {
          label: "Notice period",
          value: p.noticePeriod && labelOf(NOTICE_PERIODS, p.noticePeriod),
        },
        { label: "Earliest start", value: formatDate(p.earliestStartDate) },
        { label: "Travel", value: p.travel && labelOf(TRAVEL, p.travel) },
      ],
    },
  ].map((section) => ({
    ...section,
    rows: section.rows.filter((row) => row.value || row.chips?.length),
  }));

  const education = p.education ?? [];

  const filled = sections.filter((s) => s.rows.length);
  const empty = [
    ...sections.filter((s) => !s.rows.length),
    ...(education.length
      ? []
      : [{ key: "education", id: SECTION_IDS.education, title: "Education" }]),
  ];

  return (
    <section aria-label="Autofill details" className="mt-6">
      {empty.length > 0 && (
        <div className="mb-6 rounded-2xl border border-dashed border-brand/30 bg-brand/[0.03] p-5">
          <p className="text-sm font-medium text-slate-900">Complete your profile</p>
          <p className="mt-0.5 text-sm text-gray-500">
            The more you add, the more of each application we can fill in.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {empty.map((section) => (
              <a
                key={section.key}
                href={settingsHref(section.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-white px-4 py-2 text-sm font-medium text-brand-strong shadow-xs transition-colors hover:border-brand hover:bg-brand/10"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {section.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {(filled.length > 0 || education.length > 0) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filled.map((section) => (
            <DetailCard key={section.key} section={section}>
              <dl className="flex flex-col gap-4">
                {section.rows.map((row) => (
                  <DetailRow key={row.label} row={row} />
                ))}
              </dl>
            </DetailCard>
          ))}

          {education.length > 0 && (
            <DetailCard
              className="md:col-span-2"
              section={{
                id: SECTION_IDS.education,
                title: "Education",
                icon: GraduationCap,
                accent: "violet",
              }}
            >
              <ol className="flex flex-col gap-3">
                {education.map((entry, i) => (
                  <EducationItem key={`${entry.school}-${i}`} entry={entry} />
                ))}
              </ol>
            </DetailCard>
          )}
        </div>
      )}
    </section>
  );
}

function DetailCard({ section, className, children }) {
  const Icon = section.icon;
  return (
    <div
      className={cn("rounded-2xl border border-gray-100 bg-white p-6 shadow-xl", className)}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              ACCENT_CHIP[section.accent]
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
        </div>
        <a
          href={settingsHref(section.id)}
          aria-label={`Edit ${section.title.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-brand/10 hover:text-brand-strong"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </a>
      </div>
      {children}
    </div>
  );
}

function DetailRow({ row }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <dt className="text-xs text-gray-500">{row.label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-gray-800 break-words">
          {row.chips ? (
            <span className="mt-1 flex flex-wrap gap-1.5">
              {row.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-strong"
                >
                  {chip}
                </span>
              ))}
            </span>
          ) : (
            row.value
          )}
        </dd>
      </div>
      {row.copy && <CopyButton value={row.value} />}
    </div>
  );
}

function EducationItem({ entry }) {
  const studyLine = [entry.degree, entry.fieldOfStudy].filter(Boolean).join(" · ");
  const start = formatMonth(entry.startDate);
  const end = formatMonth(entry.endDate);
  const dates = entry.current
    ? [start, end ? `Expected ${end}` : "Present"].filter(Boolean).join(" – ")
    : [start, end].filter(Boolean).join(" – ");

  return (
    <li className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{entry.school || "School"}</p>
          {studyLine && <p className="text-sm text-gray-600">{studyLine}</p>}
          {joinParts(entry.city, entry.country) && (
            <p className="text-xs text-gray-500">{joinParts(entry.city, entry.country)}</p>
          )}
        </div>
        {dates && <p className="shrink-0 text-xs font-medium text-gray-500">{dates}</p>}
      </div>
    </li>
  );
}
