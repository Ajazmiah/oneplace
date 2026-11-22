"use server";
import mongoose from "mongoose";
import { updateTag } from "next/cache";
import Profile from "@/database/models/profileModel";
import { getUserSession } from "@/app/lib/DataAccessLayer/getSession";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";

// Server actions always answer with HTTP 200, so the outcome travels in the returned object.
// `status` uses HTTP meanings so the UI (and logs) can tell the cases apart:
//   200 saved · 400 invalid input (see fieldErrors) · 404 user missing · 409 conflict · 500 unexpected
// A signed-out caller never gets here: getUserSession() redirects to /signin.

const MAX_EDUCATION = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // <input type="date">

// Plain single-value fields, read straight from the form
const TEXT_FIELDS = [
  "firstName",
  "lastName",
  "preferredName",
  "pronouns",
  "email",
  "phoneCountryCode",
  "phoneNumber",
  "city",
  "country",
  "visaStatus",
  "requiresSponsorship",
  "willingToRelocate",
  "noticePeriod",
  "travel",
];
const DATE_FIELDS = ["visaExpiry", "earliestStartDate"];
const EDUCATION_FIELDS = ["school", "city", "country", "degree", "fieldOfStudy", "startDate", "endDate"];

// Field labels for error messages
const LABELS = {
  firstName: "First name",
  lastName: "Last name",
  preferredName: "Preferred name",
  pronouns: "Pronouns",
  email: "Email",
  phoneCountryCode: "Country code",
  phoneNumber: "Phone number",
  city: "City",
  country: "Country",
  authorizedCountries: "Authorized countries",
  visaStatus: "Citizenship or visa status",
  visaExpiry: "Visa expiry date",
  requiresSponsorship: "Sponsorship",
  willingToRelocate: "Willing to relocate",
  workModes: "Work mode",
  noticePeriod: "Notice period",
  earliestStartDate: "Earliest start date",
  travel: "Willing to travel",
  education: "Education",
  school: "School name",
  degree: "Degree",
  fieldOfStudy: "Field of study",
  startDate: "Start date",
  endDate: "End date",
};

const fail = (status, message, fieldErrors) => ({
  success: false,
  status,
  message,
  ...(fieldErrors && { fieldErrors }),
});

// Trimmed string, or undefined when blank so the field is cleared instead of saved as ""
const readText = (formData, name) => {
  const value = formData.get(name);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

/**
 * Turn the form into a profile object. Only known fields are read, so extra form fields
 * can't write anything else onto the document. Returns { data, fieldErrors }.
 */
function parseProfileForm(formData) {
  const data = {};
  const fieldErrors = {};

  for (const name of TEXT_FIELDS) {
    data[name] = readText(formData, name);
  }

  if (data.email && !EMAIL_PATTERN.test(data.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  for (const name of DATE_FIELDS) {
    const value = readText(formData, name);
    if (!value) {
      data[name] = undefined;
    } else if (!DATE_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
      fieldErrors[name] = `${LABELS[name]} isn't a valid date.`;
    } else {
      data[name] = new Date(value);
    }
  }

  // "Canada, United States" → ["Canada", "United States"]
  const countries = (readText(formData, "authorizedCountries") ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  data.authorizedCountries = countries.length ? [...new Set(countries)] : undefined;

  // Checkboxes send one value per ticked box
  const workModes = formData.getAll("workModes").filter((v) => typeof v === "string" && v);
  data.workModes = workModes.length ? [...new Set(workModes)] : undefined;

  // education[0][school], education[1][degree], ... → [{ school, degree, ... }, ...]
  const rows = new Map();
  for (const [key, value] of formData.entries()) {
    const match = /^education\[(\d+)\]\[(\w+)\]$/.exec(key);
    if (!match) continue;
    const [, index, field] = match;
    if (!rows.has(index)) rows.set(index, {});
    rows.get(index)[field] = value;
  }

  const education = [...rows.entries()]
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, row]) => {
      const entry = {};
      for (const field of EDUCATION_FIELDS) {
        const value = typeof row[field] === "string" ? row[field].trim() : "";
        if (value) entry[field] = value;
      }
      entry.current = row.current === "on" || row.current === "true";
      return entry;
    })
    // Skip entries the user added but left completely empty
    .filter((entry) => EDUCATION_FIELDS.some((field) => entry[field]));

  if (education.length > MAX_EDUCATION) {
    fieldErrors.education = `You can add up to ${MAX_EDUCATION} education entries.`;
  }

  education.forEach((entry, i) => {
    // "YYYY-MM" strings compare correctly as text
    if (entry.startDate && entry.endDate && entry.endDate < entry.startDate) {
      fieldErrors[`education.${i}.endDate`] = "End date can't be before the start date.";
    }
  });

  data.education = education.length ? education : undefined;

  return { data, fieldErrors };
}

// Mongoose validation errors → { "education.0.startDate": "Start date isn't valid." }
function toFieldErrors(validationError) {
  const fieldErrors = {};
  for (const [path, error] of Object.entries(validationError.errors)) {
    const label = LABELS[path.split(".").pop()] ?? "This field";
    switch (error.kind) {
      case "maxlength":
        fieldErrors[path] = `${label} is too long.`;
        break;
      case "enum":
        fieldErrors[path] = `Choose one of the listed options for ${label.toLowerCase()}.`;
        break;
      default:
        fieldErrors[path] = `${label} isn't valid.`;
    }
  }
  return fieldErrors;
}

/**
 * Create or update the signed-in user's autofill profile.
 * Signature fits useActionState: (previousState, formData) => state.
 * Every field is optional; a blank field clears what was saved before.
 * @returns {Promise<{ success: boolean, status: number, message: string,
 *                     fieldErrors?: Record<string, string> }>}
 */
export async function saveProfile(_prevState, formData) {
  // Redirects to /signin when there is no session
  const session = await getUserSession();

  if (!(formData instanceof FormData)) {
    return fail(400, "Invalid form submission.");
  }

  const { data, fieldErrors } = parseProfileForm(formData);
  if (Object.keys(fieldErrors).length) {
    return fail(400, "Please fix the highlighted fields.", fieldErrors);
  }

  try {
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return fail(404, "We couldn't find your account. Please sign in again.");
    }

    // Always scoped to the signed-in user; the form can't choose whose profile it edits
    const profile =
      (await Profile.findOne({ userId: user._id })) ?? new Profile({ userId: user._id });
    profile.set(data);
    await profile.save();

    // Expire the cached profile now so the next render shows what was just saved
    updateTag(`profile-${user._id.toString()}`);

    return { success: true, status: 200, message: "Profile saved." };
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return fail(400, "Please fix the highlighted fields.", toFieldErrors(error));
    }
    // Two first-time saves at once (e.g. two tabs) both try to create the profile
    if (error?.code === 11000) {
      return fail(409, "Your profile was just saved somewhere else. Please try again.");
    }
    console.error("Error saving profile:", error);
    return fail(500, "Something went wrong saving your profile. Please try again.");
  }
}
