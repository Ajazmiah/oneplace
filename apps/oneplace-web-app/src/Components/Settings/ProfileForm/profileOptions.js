// Choice options for the autofill profile: the form renders them, the profile page uses
// the labels to display saved values. Values must match the enums in profileModel.

export const VISA_STATUS = [
  { value: "citizen", label: "Citizen" },
  { value: "permanent-resident", label: "Permanent resident" },
  { value: "work-visa", label: "Work visa" },
  { value: "student-visa", label: "Student visa" },
  { value: "other", label: "Other" },
];

export const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const RELOCATE = [...YES_NO, { value: "maybe", label: "Maybe" }];

export const WORK_MODES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
];

export const NOTICE_PERIODS = [
  { value: "immediately", label: "Immediately" },
  { value: "1-week", label: "1 week" },
  { value: "2-weeks", label: "2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "2-months", label: "2 months" },
  { value: "3-months-plus", label: "3+ months" },
];

export const TRAVEL = [
  { value: "none", label: "No travel" },
  { value: "25", label: "Up to 25%" },
  { value: "50", label: "Up to 50%" },
  { value: "75-plus", label: "75% or more" },
];

export const PRONOUN_SUGGESTIONS = ["she/her", "he/him", "they/them"];

/** Label for a saved option value, e.g. labelOf(TRAVEL, "25") → "Up to 25%". */
export const labelOf = (options, value) =>
  options.find((o) => o.value === value)?.label ?? value;

// Section anchors on the settings page, so other pages can link straight to a section
export const SECTION_IDS = {
  personal: "personal",
  workAuthorization: "work-authorization",
  preferences: "preferences",
  education: "education",
  socialLinks: "social-links",
};
