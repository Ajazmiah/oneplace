const JOB_URL_PATTERNS = [
  /linkedin\.com\/jobs/,
  /indeed\.com\/(viewjob|rc\/clk)/,
  /greenhouse\.io\/jobs/,
  /jobs\.lever\.co/,
  /glassdoor\.com\/(job-listing|Job)/,
  /ziprecruiter\.com\/jobs/,
  /monster\.com\/job-openings/,
  /wellfound\.com\/jobs/,
  /dice\.com\/job-detail/,
  /simplyhired\.com\/job/,
  /smartrecruiters\.com\//,
];

function isJobPage(url) {
  return JOB_URL_PATTERNS.some((p) => p.test(url));
}

// Auto-detect job pages: show the in-page tracker banner and badge the
// toolbar icon so the side panel is a single click away (Chrome requires
// a real user gesture to open the side panel, so we can't force-open it).
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url) return;

  if (!isJobPage(tab.url)) {
    chrome.action.setBadgeText({ tabId, text: "" });
    return;
  }

  chrome.action.setBadgeText({ tabId, text: "•" });
  chrome.action.setBadgeBackgroundColor({ tabId, color: "#0bbcaa" });

  setTimeout(() => {
    chrome.tabs.sendMessage(tabId, { type: "SHOW_FORM" });
  }, 600);
});

// Open the side panel when the user clicks the extension icon.
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
