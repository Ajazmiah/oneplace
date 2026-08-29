import { useEffect, useState } from "react";
import SocialLinks, { type SocialLink } from "./components/SocialLinks";
import QuestionAnswersView from "./components/QuestionAnswersView";
import type { QAItem } from "@repo/ui/QuestionAnswersView";

const LOGIN_URL = "http://localhost:3000/signin";
const DASHBOARD_URL = "http://localhost:3000/dashboard/applications";
const ADD_APPLICATION_URL = "http://localhost:3000/api/application/add-application";

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

type Tab = "home" | "form";

const s: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh",
    gap: 16,
    padding: "20px 20px 32px",
    overflowY: "auto",
    fontFamily: "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
  },
  logo: { width: "100%", maxWidth: 150 },
  headerRow: { display: "flex", alignItems: "center", gap: 10, width: "100%" },
  avatar: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  button: {
    padding: "10px 24px",
    fontSize: 15,
    fontWeight: 500,
    color: "#fff",
    background: "#0bbcaa",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  buttonFull: {
    width: "100%",
    padding: "10px 0",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "#0bbcaa",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  tabBar: {
    display: "flex",
    width: "100%",
    background: "#f3f3f3",
    borderRadius: 8,
    padding: 3,
    gap: 2,
  },
  tabButton: {
    flex: 1,
    padding: "7px 0",
    fontSize: 13,
    fontWeight: 600,
    color: "#666",
    background: "transparent",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  tabButtonActive: {
    flex: 1,
    padding: "7px 0",
    fontSize: 13,
    fontWeight: 600,
    color: "#111",
    background: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  },
  tabContent: { width: "100%", display: "flex", flexDirection: "column", gap: 16 },
  formWrap: { width: "100%", display: "flex", flexDirection: "column", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 12, fontWeight: 500, color: "#555" },
  input: {
    padding: "8px 10px",
    fontSize: 13,
    border: "1px solid #ddd",
    borderRadius: 6,
    fontFamily: "inherit",
  },
  select: {
    padding: "8px 10px",
    fontSize: 13,
    border: "1px solid #ddd",
    borderRadius: 6,
    fontFamily: "inherit",
    background: "#fff",
  },
  textarea: {
    padding: "8px 10px",
    fontSize: 13,
    border: "1px solid #ddd",
    borderRadius: 6,
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: 70,
  },
  fileInput: { fontSize: 12 },
  errorText: { margin: 0, fontSize: 12, color: "#dc2626" },
  secondaryButton: {
    width: "100%",
    padding: "8px 0",
    fontSize: 13,
    fontWeight: 500,
    color: "#0bbcaa",
    background: "transparent",
    border: "1px solid #0bbcaa",
    borderRadius: 8,
    cursor: "pointer",
  },
  hintText: { margin: 0, fontSize: 12, color: "#888" },
};

function HomeTab({
  socialLinks,
  questionsAndAnswers,
}: {
  socialLinks: SocialLink[];
  questionsAndAnswers: QAItem[];
}) {
  return (
    <div style={s.tabContent}>
      <SocialLinks links={socialLinks} />
      <QuestionAnswersView questions={questionsAndAnswers} />
    </div>
  );
}

function AddApplicationForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [status, setStatus] = useState("applied");
  const [details, setDetails] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [error, setError] = useState("");
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
    setResume(null);
    setCoverLetter(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

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
      if (resume) formData.append("resume", resume);
      else formData.append("useDefaultResume", "true");
      if (coverLetter) formData.append("coverLetter", coverLetter);

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
      reset();
    } catch {
      setError("Network error — please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={s.formWrap}>
      <button type="button" style={s.secondaryButton} onClick={autofillFromPage} disabled={isAutofilling}>
        {isAutofilling ? "Reading page..." : "Fill from page"}
      </button>
      {autofillHint && <p style={s.hintText}>{autofillHint}</p>}

      <form onSubmit={handleSubmit} style={s.formWrap}>
        <div style={s.field}>
          <label style={s.label}>Job Title *</label>
          <input
            style={s.input}
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Company *</label>
          <input
            style={s.input}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Corp"
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Location</label>
          <input
            style={s.input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. London, UK / Remote"
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Job URL</label>
          <input
            style={s.input}
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Salary Range</label>
          <input
            style={s.input}
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            placeholder="e.g. £60,000 – £80,000"
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Status</label>
          <select style={s.select} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div style={s.field}>
          <label style={s.label}>Notes</label>
          <textarea
            style={s.textarea}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Add any notes about the role, requirements, or interview process..."
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Resume</label>
          <input
            style={s.fileInput}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files?.[0] ?? null)}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Cover Letter</label>
          <input
            style={s.fileInput}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCoverLetter(e.target.files?.[0] ?? null)}
          />
        </div>

        {error && <p style={s.errorText}>{error}</p>}

        <button type="submit" style={s.buttonFull} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Application"}
        </button>
      </form>
    </div>
  );
}

function SidePanel() {
  // undefined = still reading storage, null = read but no user, object = logged in
  const [authUser, setAuthUser] = useState<AuthUser | undefined>(undefined);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<QAItem[]>([]);
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    chrome.storage.local.get(["authUser", "socialLinks", "questionsAndAnswers"], (result) => {
      setAuthUser(result.authUser ?? null);
      setSocialLinks(result.socialLinks ?? []);
      setQuestionsAndAnswers(result.questionsAndAnswers ?? []);
    });

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
    };
    chrome.storage.onChanged.addListener(onChange);
    return () => chrome.storage.onChanged.removeListener(onChange);
  }, []);

  const login = () => chrome.tabs.create({ url: LOGIN_URL });
  const openDashboard = () => chrome.tabs.create({ url: DASHBOARD_URL });

  if (authUser === undefined) {
    // Avoid flashing the logged-out view while storage is still being read.
    return <div style={s.wrap} />;
  }

  return (
    <div style={s.wrap}>
      <img src="/logo.svg" alt="OnePlace" style={s.logo} />

      {authUser ? (
        <>
          <div style={s.headerRow}>
            {authUser.image && (
              <img src={authUser.image} alt={authUser.name ?? "User"} style={s.avatar} />
            )}
            <span style={s.name}>{authUser.name ?? authUser.email}</span>
          </div>

          <button onClick={openDashboard} style={s.button}>
            Open Dashboard
          </button>

          <div style={s.tabBar}>
            <button
              style={tab === "home" ? s.tabButtonActive : s.tabButton}
              onClick={() => setTab("home")}
            >
              Home
            </button>
            <button
              style={tab === "form" ? s.tabButtonActive : s.tabButton}
              onClick={() => setTab("form")}
            >
              Save Application
            </button>
          </div>

          {tab === "home" ? (
            <HomeTab socialLinks={socialLinks} questionsAndAnswers={questionsAndAnswers} />
          ) : (
            <AddApplicationForm />
          )}
        </>
      ) : (
        <button onClick={login} style={s.button}>
          Log in
        </button>
      )}
    </div>
  );
}

export default SidePanel;
