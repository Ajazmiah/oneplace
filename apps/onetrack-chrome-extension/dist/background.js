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

// Auto-detect job pages: badge the toolbar icon so the side panel's
// "Add Application" tab is a single click away (Chrome requires a real
// user gesture to open the side panel, so we can't force-open it).
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url) return;

  if (!isJobPage(tab.url)) {
    chrome.action.setBadgeText({ tabId, text: "" });
    return;
  }

  chrome.action.setBadgeText({ tabId, text: "•" });
  chrome.action.setBadgeBackgroundColor({ tabId, color: "#0bbcaa" });
});

// Open the side panel when the user clicks the extension icon.
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Cache the web app's session state so the side panel can read it.
chrome.runtime.onMessageExternal.addListener((message, sender) => {
  if (sender.origin !== "http://localhost:3000") return; // defense in depth beyond the manifest check
  if (message.type !== "AUTH_STATE") return;
  chrome.storage.local.set({
    authUser: message.user,
    socialLinks: message.user ? (message.socialLinks ?? []) : [],
  });
});