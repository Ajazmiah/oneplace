import CopyButton from "./CopyButton";

export type SocialLink = {
  socialLabel: string;
  url: string;
};

const s: Record<string, React.CSSProperties> = {
  sectionTitle: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#888",
  },
  emptyText: { margin: 0, fontSize: 13, color: "#999" },
  linksWrap: { width: "100%", display: "flex", flexDirection: "column", gap: 8 },
  linkRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "8px 12px",
    border: "1px solid #eee",
    borderRadius: 8,
    fontSize: 13,
  },
  linkLabel: {
    color: "#111",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <div>
      <p style={s.sectionTitle}>Social Links</p>
      {links.length === 0 ? (
        <p style={s.emptyText}>No social links saved yet.</p>
      ) : (
        <div style={s.linksWrap}>
          {links.map((link) => (
            <div key={link.socialLabel} style={s.linkRow}>
              <span style={s.linkLabel} title={link.url}>
                {link.url}
              </span>
              <CopyButton text={link.url} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
