import { useState } from "react";

type JobData = {
  title?: string;
  location?: string;
  description?: string;
  url?: string;
};

function Popup() {
  const [job, setJob] = useState<JobData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrapeCurrentTab = async () => {
    setError(null);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id!, { type: "SCRAPE_JOB" }, (data) => {
      if (chrome.runtime.lastError) {
        setError("Could not scrape — make sure you're on a supported job page.");
        return;
      }
      setJob(data);
    });
  };

  return (
    <div style={{ padding: 12, width: 320 }}>
      <h2>Job Scraper</h2>
      <button onClick={scrapeCurrentTab}>Scrape This Page</button>
      {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
      <pre style={{ fontSize: 12, marginTop: 10 }}>
        {job ? JSON.stringify(job, null, 2) : "No data yet"}
      </pre>
    </div>
  );
}

export default Popup;
