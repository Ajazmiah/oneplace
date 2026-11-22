// Autofill profile form. Server component: loads the saved profile and renders the
// sections; ProfileFormShell (client) submits them to saveProfile, and EducationEntries
// (client) handles the repeating education list. Field names match profileModel.
import { User, BadgeCheck, SlidersHorizontal, GraduationCap } from "lucide-react";
import { getProfile } from "@/app/lib/DataAccessLayer/profile";
import ProfileSection from "./ProfileSection";
import ProfileFormShell from "./ProfileFormShell";
import EducationEntries from "./EducationEntries";
import { Field, TextInput, NativeSelect, ChoicePills } from "./FormFields";
import {
  VISA_STATUS,
  YES_NO,
  RELOCATE,
  WORK_MODES,
  NOTICE_PERIODS,
  TRAVEL,
  PRONOUN_SUGGESTIONS,
  SECTION_IDS,
} from "./profileOptions";

// Saved dates arrive as ISO strings; <input type="date"> wants "YYYY-MM-DD"
const toDateInput = (iso) => (iso ? iso.slice(0, 10) : undefined);

export default async function ProfileForm() {
  const p = (await getProfile()) ?? {};

  return (
    <ProfileFormShell>
      <ProfileSection
        id={SECTION_IDS.personal}
        icon={User}
        accent="brand"
        title="Personal"
        description="Basic details most application forms ask for first."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Legal first name" htmlFor="firstName">
            <TextInput
              id="firstName"
              name="firstName"
              defaultValue={p.firstName}
              autoComplete="given-name"
            />
          </Field>
          <Field label="Legal last name" htmlFor="lastName">
            <TextInput
              id="lastName"
              name="lastName"
              defaultValue={p.lastName}
              autoComplete="family-name"
            />
          </Field>
          <Field label="Preferred name" htmlFor="preferredName" optional>
            <TextInput
              id="preferredName"
              name="preferredName"
              defaultValue={p.preferredName}
              autoComplete="nickname"
            />
          </Field>
          <Field label="Pronouns" htmlFor="pronouns" optional>
            <TextInput
              id="pronouns"
              name="pronouns"
              defaultValue={p.pronouns}
              list="pronoun-suggestions"
            />
            <datalist id="pronoun-suggestions">
              {PRONOUN_SUGGESTIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </Field>
          <Field label="Email" htmlFor="email">
            <TextInput
              id="email"
              name="email"
              type="email"
              defaultValue={p.email}
              autoComplete="email"
            />
          </Field>
          <Field
            label="Phone"
            htmlFor="phoneNumber"
            errorFor={["phoneCountryCode", "phoneNumber"]}
          >
            <div className="flex gap-2">
              <TextInput
                aria-label="Country code"
                name="phoneCountryCode"
                defaultValue={p.phoneCountryCode}
                placeholder="+1"
                autoComplete="tel-country-code"
                className="w-20 shrink-0"
              />
              <TextInput
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                defaultValue={p.phoneNumber}
                placeholder="555 123 4567"
                autoComplete="tel-national"
              />
            </div>
          </Field>
          <Field label="City" htmlFor="city">
            <TextInput id="city" name="city" defaultValue={p.city} autoComplete="address-level2" />
          </Field>
          <Field label="Country" htmlFor="country">
            <TextInput
              id="country"
              name="country"
              defaultValue={p.country}
              autoComplete="country-name"
            />
          </Field>
        </div>
      </ProfileSection>

      <ProfileSection
        id={SECTION_IDS.workAuthorization}
        icon={BadgeCheck}
        accent="sky"
        title="Work authorization"
        description="Where you can work and whether you'll need sponsorship."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Authorized to work in"
            htmlFor="authorizedCountries"
            hint="Separate countries with commas."
            className="sm:col-span-2"
          >
            <TextInput
              id="authorizedCountries"
              name="authorizedCountries"
              defaultValue={p.authorizedCountries?.join(", ")}
              placeholder="e.g. Canada, United States"
            />
          </Field>
          <Field label="Citizenship or visa status" htmlFor="visaStatus">
            <NativeSelect
              id="visaStatus"
              name="visaStatus"
              defaultValue={p.visaStatus}
              options={VISA_STATUS}
            />
          </Field>
          <Field label="Visa expiry date" htmlFor="visaExpiry" optional>
            <TextInput
              id="visaExpiry"
              name="visaExpiry"
              type="date"
              defaultValue={toDateInput(p.visaExpiry)}
            />
          </Field>
          <div className="sm:col-span-2">
            <ChoicePills
              legend="Will you need sponsorship now or in the future?"
              name="requiresSponsorship"
              defaultValue={p.requiresSponsorship}
              options={YES_NO}
            />
          </div>
        </div>
      </ProfileSection>

      <ProfileSection
        id={SECTION_IDS.preferences}
        icon={SlidersHorizontal}
        accent="amber"
        title="Preferences"
        description="The kind of roles you're open to."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ChoicePills
            legend="Willing to relocate?"
            name="willingToRelocate"
            defaultValue={p.willingToRelocate}
            options={RELOCATE}
          />
          <ChoicePills
            legend="Work mode"
            name="workModes"
            type="checkbox"
            defaultValue={p.workModes}
            options={WORK_MODES}
          />
          <Field label="Notice period" htmlFor="noticePeriod">
            <NativeSelect
              id="noticePeriod"
              name="noticePeriod"
              defaultValue={p.noticePeriod}
              options={NOTICE_PERIODS}
            />
          </Field>
          <Field label="Earliest start date" htmlFor="earliestStartDate" optional>
            <TextInput
              id="earliestStartDate"
              name="earliestStartDate"
              type="date"
              defaultValue={toDateInput(p.earliestStartDate)}
            />
          </Field>
          <Field label="Willing to travel" htmlFor="travel" optional>
            <NativeSelect id="travel" name="travel" defaultValue={p.travel} options={TRAVEL} />
          </Field>
        </div>
      </ProfileSection>

      <ProfileSection
        id={SECTION_IDS.education}
        icon={GraduationCap}
        accent="violet"
        title="Education"
        description="Add each school, starting with the most recent."
      >
        <EducationEntries initialEntries={p.education} />
      </ProfileSection>
    </ProfileFormShell>
  );
}
