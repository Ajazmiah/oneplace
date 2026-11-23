// Product name shown across the UI. SVG logos and CSS can't import this, so they hardcode it.
export const APP_NAME = "OneSimplifyd";
export const CONTACT_EMAIL = `hello@${APP_NAME.toLowerCase()}.com`;

// How many resumes a user can keep in their library. Shared by the server (resumeModel)
// and the pickers; the extension has its own copy in ResumePicker.tsx.
export const MAX_RESUMES = 3;

// Chrome Web Store link for the extension. Leave empty until it's published;
// while empty, the "Download our extension" button does nothing.
export const EXTENSION_URL = "";
