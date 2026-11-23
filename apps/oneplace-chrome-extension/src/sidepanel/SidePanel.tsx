import { useEffect, useState } from "react";
import SocialLinks, { type SocialLink } from "./components/SocialLinks";
import QuestionAnswersView, { type QAItem } from "./components/QuestionAnswersView";
import ProfileInfo, { type Profile } from "./components/ProfileInfo";
import ResumePicker, {
  initialResumeChoice,
  type LibraryResume,
  type ResumeChoice,
} from "./components/ResumePicker";
import {
  AlertIcon,
  CheckIcon,
  ExternalIcon,
  FileIcon,
  HomeIcon,
  PlusIcon,
  SparklesIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "./components/Icons";

const WEB_APP_URL = import.meta.env.VITE_WEB_APP_URL;
const LOGIN_URL = `${WEB_APP_URL}/signin`;
const DASHBOARD_URL = `${WEB_APP_URL}/dashboard/applications`;
const SETTINGS_URL = `${WEB_APP_URL}/dashboard/settings`;
const ADD_APPLICATION_URL = `${WEB_APP_URL}/api/application/add-application`;
const PRESIGN_URL = `${WEB_APP_URL}/api/uploads/presign`;

// Upload a file straight to S3 and add its key to the form, so the bytes never pass through
// the web app's server (Vercel rejects request bodies over 4.5MB). Same flow as
// uploadToS3.js in the web app. The bucket URL must be in manifest.json host_permissions.
async function appendUpload(formData: FormData, field: "resume" | "coverLetter", file: File) {
  const res = await fetch(PRESIGN_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mimetype: file.type, size: file.size }),
  });
  const presign = await res.json().catch(() => null);
  if (!res.ok || !presign?.success) {
    throw new Error(presign?.message || "Could not start the upload.");
  }

  const form = new FormData();
  Object.entries(presign.fields as Record<string, string>).forEach(([name, value]) =>
    form.append(name, value)
  );
  form.append("file", file); // S3 requires the file to be the last field

  const upload = await fetch(presign.url, { method: "POST", body: form });
  if (!upload.ok) throw new Error("Upload failed. Please try again.");

  formData.append(`${field}Key`, presign.key);
  formData.append(`${field}Name`, file.name);
}

type AuthUser = {
  name?: string;
  email?: string;
  image?: string;
} | null;

type ScrapedJob = {
  jobTitle: string;
  companyName: string;
  location: string;
  jobUrl: string;
  details: string;
};

type Tab = "home" | "info" | "form";

// "Save" rather than "Save Application" so three tabs with icons fit a narrow side panel
const TABS: { id: Tab; label: string; Icon: (p: { size?: number }) => React.ReactElement }[] = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "info", label: "Info", Icon: UserIcon },
  { id: "form", label: "Save", Icon: PlusIcon },
];

function HomeTab({ questionsAndAnswers }: { questionsAndAnswers: QAItem[] }) {
  return (
    <section className="qa" aria-labelledby="qa-title">
      <div className="qa-header">
        <span className="section-pill" id="qa-title">
          Saved answers
        </span>
        {questionsAndAnswers.length > 0 && (
          <span className="card-count">{questionsAndAnswers.length}</span>
        )}
      </div>
      <QuestionAnswersView questions={questionsAndAnswers} />
    </section>
  );
}

function InfoTab({ socialLinks, profile }: { socialLinks: SocialLink[]; profile: Profile }) {
  return (
    <>
      <ProfileInfo profile={profile} settingsUrl={SETTINGS_URL} />
      <SocialLinks links={socialLinks} />
    </>
  );
}

function AddApplicationForm({ resumes }: { resumes: LibraryResume[] }) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [status, setStatus] = useState("applied");
  const [details, setDetails] = useState("");
  // undefined = not touched: follow the most recently used resume, even if the list changes
  // while the panel is open. A picked resume that's since been deleted falls back to that too.
  const [pickedResume, setPickedResume] = useState<ResumeChoice | undefined>(undefined);
  const pickedIsGone =
    pickedResume?.type === "library" && !resumes.some((r) => r._id === pickedResume.id);
  const resumeChoice =
    pickedResume === undefined || pickedIsGone ? initialResumeChoice(resumes) : pickedResume;
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autofillHint, setAutofillHint] = useState("");
  const [isAutofilling, setIsAutofilling] = useState(false);

  const autofillFromPage = async () => {
    setAutofillHint("");
    setIsAutofilling(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      chrome.tabs.sendMessage(tab.id, { type: "SCRAPE_JOB" }, (data: ScrapedJob | undefined) => {
        setIsAutofilling(false);
        if (chrome.runtime.lastError || !data) {
          setAutofillHint("Couldn't read this page — open a supported job listing first.");
          return;
        }
        if (data.jobTitle) setJobTitle(data.jobTitle);
        if (data.companyName) setCompanyName(data.companyName);
        if (data.location) setLocation(data.location);
        if (data.jobUrl) setJobUrl(data.jobUrl);
        if (data.details) setDetails(data.details);
      });
    } catch {
      setIsAutofilling(false);
      setAutofillHint("Couldn't read this page — open a supported job listing first.");
    }
  };

  const reset = () => {
    setJobTitle("");
    setCompanyName("");
    setLocation("");
    setJobUrl("");
    setSalaryRange("");
    setStatus("applied");
    setDetails("");
    setPickedResume(undefined);
    setCoverLetter(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!jobTitle || !companyName) {
      setError("Job title and company are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("jobTitle", jobTitle);
      formData.append("companyName", companyName);
      formData.append("location", location);
      formData.append("jobUrl", jobUrl);
      formData.append("salaryRange", salaryRange);
      formData.append("status", status);
      formData.append("details", details);
      if (resumeChoice?.type === "library") formData.append("resumeId", resumeChoice.id);
      if (resumeChoice?.type === "new") await appendUpload(formData, "resume", resumeChoice.file);
      if (coverLetter) await appendUpload(formData, "coverLetter", coverLetter);

      const res = await fetch(ADD_APPLICATION_URL, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();

      if (!data?.success) {
        setError(data?.message || "Something went wrong");
        return;
      }
      // The resume just used (picked, or newly added to the library) moves to the top as
      // "last used"; update the stored list now instead of waiting for a dashboard sync
      const used: LibraryResume | null = data.resume ?? null;
      if (used) {
        chrome.storage.local.set({
          resumes: [used, ...resumes.filter((r) => r._id !== used._id)],
        });
      }
      reset();
      setSuccess("Application saved");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      // fetch() throws TypeError when offline; upload errors carry a readable message
      setError(
        err instanceof TypeError || !(err instanceof Error)
          ? "Network error — please try again"
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="autofill-card"
        onClick={autofillFromPage}
        disabled={isAutofilling}
      >
        <span className="autofill-icon">
          {isAutofilling ? <span className="spinner" /> : <SparklesIcon size={18} />}
        </span>
        <span>
          <span className="autofill-title">
            {isAutofilling ? "Reading this page…" : "Read this job page"}
          </span>
          <span className="autofill-sub">Fill in the title, company and details for you</span>
        </span>
      </button>
      {autofillHint && (
        <p className="banner banner-info" role="status">
          <AlertIcon size={15} />
          {autofillHint}
        </p>
      )}

      <form onSubmit={handleSubmit} className="form" noValidate>
        <section className="card form-card" aria-label="Role details">
          <span className="section-pill">Role</span>
          <div className="form-grid">
            <div className="field field-full">
              <label className="label" htmlFor="jobTitle">
                Job title <span className="required">*</span>
              </label>
              <input
                id="jobTitle"
                className="input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>

            <div className="field field-full">
              <label className="label" htmlFor="companyName">
                Company <span className="required">*</span>
              </label>
              <input
                id="companyName"
                className="input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                className="input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="London / Remote"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="salaryRange">
                Salary range
              </label>
              <input
                id="salaryRange"
                className="input"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="£60k – £80k"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="jobUrl">
                Job URL
              </label>
              <input
                id="jobUrl"
                className="input"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>

            <div className="field field-full">
              <label className="label" htmlFor="details">
                Notes
              </label>
              <textarea
                id="details"
                className="textarea"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Requirements, contacts, interview process…"
              />
            </div>
          </div>
        </section>

        <section className="card form-card" aria-label="Documents">
          <span className="section-pill">Documents</span>

          <div className="field">
            <span className="label">Resume</span>
            <ResumePicker
              resumes={resumes}
              value={resumeChoice}
              onChange={setPickedResume}
              webAppUrl={WEB_APP_URL}
            />
          </div>

          <div className="field">
            <span className="label">Cover letter</span>
            {coverLetter ? (
              <div className="file-chosen">
                <FileIcon size={16} />
                <span className="file-name" title={coverLetter.name}>
                  {coverLetter.name}
                </span>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Remove cover letter"
                  onClick={() => setCoverLetter(null)}
                >
                  <XIcon size={15} />
                </button>
              </div>
            ) : (
              <label className="file-drop">
                <UploadIcon size={16} />
                <span>Upload cover letter (optional)</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="visually-hidden"
                  onChange={(e) => setCoverLetter(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>
        </section>

        {error && (
          <p className="banner banner-error" role="alert">
            <AlertIcon size={15} />
            {error}
          </p>
        )}
        {success && (
          <p className="banner banner-success" role="status">
            <CheckIcon size={15} />
            {success}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
          {isSubmitting && <span className="spinner" />}
          {isSubmitting ? "Saving…" : "Save application"}
        </button>
      </form>
    </>
  );
}

function SidePanel() {
  // undefined = still reading storage, null = read but no user, object = logged in
  const [authUser, setAuthUser] = useState<AuthUser | undefined>(undefined);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<QAItem[]>([]);
  const [profile, setProfile] = useState<Profile>(null);
  const [resumes, setResumes] = useState<LibraryResume[]>([]);
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    chrome.storage.local.get(
      ["authUser", "socialLinks", "questionsAndAnswers", "profile", "resumes"],
      (result) => {
        setAuthUser(result.authUser ?? null);
        setSocialLinks(result.socialLinks ?? []);
        setQuestionsAndAnswers(result.questionsAndAnswers ?? []);
        setProfile(result.profile ?? null);
        setResumes(result.resumes ?? []);
      }
    );

    const onChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area !== "local") return;
      if (changes.authUser) setAuthUser(changes.authUser.newValue ?? null);
      if (changes.socialLinks) setSocialLinks(changes.socialLinks.newValue ?? []);
      if (changes.questionsAndAnswers) {
        setQuestionsAndAnswers(changes.questionsAndAnswers.newValue ?? []);
      }
      if (changes.profile) setProfile(changes.profile.newValue ?? null);
      if (changes.resumes) setResumes(changes.resumes.newValue ?? []);
    };
    chrome.storage.onChanged.addListener(onChange);
    return () => chrome.storage.onChanged.removeListener(onChange);
  }, []);

  const login = () => chrome.tabs.create({ url: LOGIN_URL });
  const openDashboard = () => chrome.tabs.create({ url: DASHBOARD_URL });

  if (authUser === undefined) {
    // Avoid flashing the logged-out view while storage is still being read.
    return <div className="app" />;
  }

  if (!authUser) {
    return (
      <div className="app">
        <main className="welcome">
          <img src="/logo.svg" alt="OneSimplifyd" className="welcome-logo" />
          <h1 className="welcome-title">Apply faster, from any job page</h1>
          <p className="welcome-text">
            Sign in to save applications, reuse your answers and keep your details one click away.
          </p>
          <ul className="welcome-points">
            <li>
              <CheckIcon size={15} /> Save a job straight from the listing
            </li>
            <li>
              <CheckIcon size={15} /> Copy your saved answers and details
            </li>
            <li>
              <CheckIcon size={15} /> Pick from your saved resumes
            </li>
          </ul>
          <button type="button" className="btn btn-primary btn-block" onClick={login}>
            Sign in
          </button>
        </main>
      </div>
    );
  }

  const displayName = authUser.name ?? authUser.email ?? "";

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-row">
          <img src="/logo.svg" alt="OneSimplifyd" className="topbar-logo" />
          <span className="topbar-spacer" />
          <div className="user-chip">
            {authUser.image ? (
              <img src={authUser.image} alt="" className="avatar" />
            ) : (
              <span className="avatar avatar-fallback" aria-hidden="true">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="user-name" title={displayName}>
              {displayName}
            </span>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={openDashboard}
            aria-label="Open dashboard"
            title="Open dashboard"
          >
            <ExternalIcon size={16} />
          </button>
        </div>

        <div className="tabs" role="tablist" aria-label="Sections">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls="tab-panel"
              className="tab"
              onClick={() => setTab(id)}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="content" id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "home" && <HomeTab questionsAndAnswers={questionsAndAnswers} />}
        {tab === "info" && <InfoTab socialLinks={socialLinks} profile={profile} />}
        {tab === "form" && <AddApplicationForm resumes={resumes} />}
      </main>
    </div>
  );
}

export default SidePanel;
