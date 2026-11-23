import CopyButton from "./CopyButton";
import { LinkIcon } from "./Icons";

export type SocialLink = {
  socialLabel: string;
  url: string;
};

const LABELS: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  website: "Website",
};

// "https://www.linkedin.com/in/me/" → "linkedin.com/in/me"
const shortUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <section className="card" aria-labelledby="social-links-title">
      <div className="card-header">
        <span className="section-pill" id="social-links-title">
          Social links
        </span>
        {links.length > 0 && <span className="card-count">{links.length}</span>}
      </div>

      {links.length === 0 ? (
        <p className="empty">No social links saved yet.</p>
      ) : (
        <div className="rows">
          {links.map((link) => (
            <div key={link.socialLabel} className="row">
              <span className="row-icon">
                <LinkIcon size={15} />
              </span>
              <div className="row-text">
                <span className="row-label">
                  {LABELS[link.socialLabel] ?? link.socialLabel}
                </span>
                <span className="row-value" title={link.url}>
                  {shortUrl(link.url)}
                </span>
              </div>
              <CopyButton text={link.url} label={`Copy ${link.socialLabel} link`} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
