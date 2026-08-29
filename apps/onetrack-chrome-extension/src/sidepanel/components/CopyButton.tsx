import { useState } from "react";

const style: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 500,
  color: "#0bbcaa",
  background: "transparent",
  border: "1px solid #0bbcaa",
  borderRadius: 6,
  cursor: "pointer",
  flexShrink: 0,
};

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button style={style} onClick={copy}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
