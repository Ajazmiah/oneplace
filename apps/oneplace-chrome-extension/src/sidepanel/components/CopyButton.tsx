import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./Icons";

/** Icon button that copies `text`; shows a check for a moment after copying. */
export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      className="icon-btn"
      data-copied={copied}
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}
