import mongoose from "mongoose";

export const VISA_STATUS = ["citizen", "permanent-resident", "work-visa", "student-visa", "other"];
export const YES_NO = ["yes", "no"];
export const RELOCATE = ["yes", "no", "maybe"];
export const WORK_MODES = ["remote", "hybrid", "on-site"];
export const NOTICE_PERIODS = ["immediately", "1-week", "2-weeks", "1-month", "2-months", "3-months-plus"];
export const TRAVEL = ["none", "25", "50", "75-plus"];

// "YYYY-MM", the value of an <input type="month">
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

const text = (maxlength = 100) => ({ type: String, trim: true, maxlength });
const choice = (values) => ({ type: String, enum: values });
const month = { type: String, match: MONTH_PATTERN };

const educationSchema = new mongoose.Schema(
  {
    school: text(150),
    city: text(),
    country: text(),
    degree: text(),
    fieldOfStudy: text(),
    startDate: month,
    endDate: month, // expected graduation when `current` is true
    current: { type: Boolean, default: false },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true, // one profile per user, so saves can upsert on userId
    },

    // Personal
    firstName: text(),
    lastName: text(),
    preferredName: text(),
    pronouns: text(30),
    email: { ...text(254), lowercase: true },
    phoneCountryCode: { type: String, trim: true, match: /^\+?\d{1,4}$/ },
    phoneNumber: text(30),
    city: text(),
    country: text(),

    // Work authorization
    authorizedCountries: { type: [text()], default: undefined },
    visaStatus: choice(VISA_STATUS),
    visaExpiry: { type: Date },
    requiresSponsorship: choice(YES_NO),

    // Preferences
    willingToRelocate: choice(RELOCATE),
    workModes: { type: [choice(WORK_MODES)], default: undefined },
    noticePeriod: choice(NOTICE_PERIODS),
    earliestStartDate: { type: Date },
    travel: choice(TRAVEL),

    // Education, most recent first
    education: {
      type: [educationSchema],
      validate: [(list) => list.length <= 10, "At most 10 education entries"],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// Avoid OverwriteModelError on dev hot reloads
const Profile = mongoose.models?.profile || mongoose.model("profile", profileSchema);

export default Profile;
