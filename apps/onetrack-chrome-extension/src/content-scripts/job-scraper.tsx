import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const s: Record<string, React.CSSProperties> = {
  panel: {
    position: "fixed",
    top: 0,
    right: 0,
    width: 420,
    height: "100vh",
    background: "#fff",
    boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
    zIndex: 2147483647,
    padding: "24px 20px",
    overflowY: "auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: 14,
    color: "#111",
    boxSizing: "border-box",
    transition: "transform 0.3s ease",
  },
  hidden: { transform: "translateX(100%)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  closeBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 4 },
  group: { marginBottom: 16 },
  label: { display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13 },
  input: { width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box" as const },
  textarea: { width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, resize: "vertical" as const, boxSizing: "border-box" as const },
  submitBtn: { width: "100%", padding: "10px 0", background: "#111", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 },
};

function scrapeTitle(): string {
  return document.querySelector("h1")?.textContent?.trim() ?? "";
}

// Module-level show callback — registered synchronously so SHOW_FORM
// from background arrives even before React's first useEffect runs.
let _show: (() => void) | null = null;
let _pending = false;

chrome.runtime.onMessage.addListener((msg: { type: string }) => {
  if (msg.type !== "SHOW_FORM") return;
  if (_show) _show();
  else _pending = true; // queued until component mounts
});

function JobLogPanel() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    resume: null as File | null,
    coverLetter: null as File | null,
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, jobTitle: scrapeTitle() }));
    _show = () => setOpen(true);
    if (_pending) { setOpen(true); _pending = false; }
    return () => { _show = null; };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = e.target;
    if (files) setForm((prev) => ({ ...prev, [name]: files[0] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("companyName", form.companyName);
    formData.append("jobTitle", form.jobTitle);
    formData.append("jobDescription", form.jobDescription);
    if (form.resume) formData.append("resume", form.resume);
    if (form.coverLetter) formData.append("coverLetter", form.coverLetter);

    // TODO: POST to OneTrack web app API
    console.log("OneTrack submit:", Object.fromEntries(formData.entries()));
    setOpen(false);
  }

  return (
    <div style={{ ...s.panel, ...(open ? {} : s.hidden) }}>
      <div style={s.header}>
        <h2 style={s.title}>Track This Job</h2>
        <button style={s.closeBtn} onClick={() => setOpen(false)}>✕</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={s.group}>
          <label style={s.label}>Company Name</label>
          <input style={s.input} name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Acme Corp" />
        </div>

        <div style={s.group}>
          <label style={s.label}>Job Title</label>
          <input style={s.input} name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g. Frontend Engineer" />
        </div>

        <div style={s.group}>
          <label style={s.label}>Resume</label>
          <input style={s.input} type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        </div>

        <div style={s.group}>
          <label style={s.label}>Cover Letter</label>
          <input style={s.input} type="file" name="coverLetter" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        </div>

        <div style={s.group}>
          <label style={s.label}>Job Description</label>
          <textarea style={s.textarea} name="jobDescription" value={form.jobDescription} onChange={handleChange} rows={5} placeholder="Paste the job description…" />
        </div>

        <button type="submit" style={s.submitBtn}>Save to OneTrack</button>
      </form>
    </div>
  );
}

// Guard: declarative content_scripts + programmatic executeScript can both
// run on matched pages. Only mount once.
if (!(window as any).__onetrackInit) {
  (window as any).__onetrackInit = true;
  const host = document.createElement("div");
  host.id = "onetrack-root";
  document.body.appendChild(host);
  createRoot(host).render(<JobLogPanel />);
}
