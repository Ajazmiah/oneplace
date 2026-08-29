function scrapeTitle(): string {
  return document.querySelector("h1")?.textContent?.trim() ?? "";
}

function stripHtml(html: string): string {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent?.trim() ?? "";
  } catch {
    return html;
  }
}

// Most job boards (Indeed, Greenhouse, Lever, ZipRecruiter, etc.) embed a
// schema.org JobPosting block for Google for Jobs SEO — reading that is far
// more reliable across sites than per-site CSS selectors.
function getJobPostingJsonLd(): any | null {
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent ?? "");
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item?.["@type"] === "JobPosting") return item;
        const fromGraph = item?.["@graph"]?.find((g: any) => g?.["@type"] === "JobPosting");
        if (fromGraph) return fromGraph;
      }
    } catch {
      // malformed JSON-LD — skip this block
    }
  }
  return null;
}

function scrapeJob() {
  const jsonLd = getJobPostingJsonLd();

  const address = jsonLd?.jobLocation?.address;
  const location = address
    ? [address.addressLocality, address.addressRegion, address.addressCountry]
        .filter(Boolean)
        .join(", ")
    : "";

  return {
    jobTitle: jsonLd?.title || scrapeTitle(),
    companyName: jsonLd?.hiringOrganization?.name ?? "",
    location,
    jobUrl: window.location.href,
    details: jsonLd?.description ? stripHtml(jsonLd.description) : "",
  };
}

// Lets the side panel pull scraped job details for its own "Add Application" form.
chrome.runtime.onMessage.addListener((msg: { type: string }, _sender, sendResponse) => {
  if (msg.type !== "SCRAPE_JOB") return;
  sendResponse(scrapeJob());
});
