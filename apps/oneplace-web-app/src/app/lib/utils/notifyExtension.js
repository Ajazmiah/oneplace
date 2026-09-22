export function notifyExtension(payload) {
  const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;
  if (!EXTENSION_ID) return;
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) return;
  chrome.runtime.sendMessage(EXTENSION_ID, payload);
}
