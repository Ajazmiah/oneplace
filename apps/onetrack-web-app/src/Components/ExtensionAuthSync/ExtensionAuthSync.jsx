"use client";

import { useEffect } from "react";

const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

export default function ExtensionAuthSync({ user, socialLinks }) {
  useEffect(() => {
    if (!EXTENSION_ID) return;
    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) return; // extension not installed

    chrome.runtime.sendMessage(EXTENSION_ID, {
      type: "AUTH_STATE",
      user,
      socialLinks,
    });
  }, [user, socialLinks]);

  return null;
}
