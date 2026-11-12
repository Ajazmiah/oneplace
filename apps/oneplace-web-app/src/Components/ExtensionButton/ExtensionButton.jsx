import { FaChrome } from "react-icons/fa";
import { EXTENSION_URL } from "@/app/lib/constants";

// White pill with the brand text color, so it reads on both the green header/hero and white sections
const baseClass =
  "inline-flex items-center gap-2 rounded-full bg-white font-semibold text-[#085041] ring-1 ring-black/5 hover:bg-[#ccf3ee] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong";

const sizes = {
  sm: { button: "px-3 py-1.5 text-sm/6 shadow-sm", icon: "size-4" },
  lg: { button: "px-5 py-3 text-sm shadow-xl", icon: "size-5" },
};

// Chrome extension button, opens the Chrome Web Store listing. Becomes a real link once EXTENSION_URL is set in lib/constants.js;
// until then it renders a button that does nothing.
// `className` is for placement (e.g. fixed positioning, full width); `size` controls padding and text.
function ExtensionButton({
  size = "lg",
  label = "Extension",
  className = "",
  onClick,
}) {
  const { button, icon } = sizes[size] ?? sizes.lg;
  const classes = `${baseClass} ${button} ${className}`;

  const content = (
    <>
      <FaChrome className={icon} aria-hidden="true" />
      {label}
    </>
  );

  if (EXTENSION_URL) {
    return (
      <a
        href={EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

export default ExtensionButton;
