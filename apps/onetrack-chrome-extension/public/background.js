const JOB_URL_PATTERNS = [
  /linkedin\.com\/jobs/,
  /indeed\.com\/(viewjob|rc\/clk)/,
  /greenhouse\.io\/jobs/,
  /jobs\.lever\.co/,
];

function isJobPage(url) {
  return JOB_URL_PATTERNS.some((p) => p.test(url));
}

// Auto-open when navigating to a matched job URL.
// Content script is already injected by manifest, just tell it to show.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url || !isJobPage(tab.url)) return;

  setTimeout(() => {
    chrome.tabs.sendMessage(tabId, { type: "SHOW_FORM" });
  }, 600);
});

// Open on any page when the user clicks the extension icon.
// Programmatically inject the content script first (no-op if already injected).
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-scripts/job-scraper.js"],
    });
  } catch {
    // chrome://, edge://, or other restricted pages — silently bail
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: "SHOW_FORM" });
});
