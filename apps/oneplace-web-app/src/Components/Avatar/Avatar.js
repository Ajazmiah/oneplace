"use client";
import React, { forwardRef } from "react";

// Trigger for the account menu: a real button so it can be reached with Tab
// and opened with Enter/Space. The image is decorative; the label names the button.
const Avatar = forwardRef(({ session, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Open account menu"
      {...props}
      className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#085041]"
    >
      <img
        src={session?.user?.image}
        alt=""
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
    </button>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
