import { createHmac, timingSafeEqual } from "crypto";

// Short-lived signed cookie proving the user passed the 18+ check on /confirm-age.
// Read by the signIn callback in auth.js before a new account is created.
export const AGE_COOKIE = "age_verified";
export const AGE_COOKIE_MAX_AGE = 10 * 60; // 10 minutes, in seconds

export const AGE_ERROR = "You must be 18 or older to create an account.";

export function isValidAge(age) {
  if (age === null || age === undefined || String(age).trim() === "") {
    return false;
  }
  const value = Number(age);
  return Number.isInteger(value) && value >= 18 && value <= 120;
}

function sign(value) {
  return createHmac("sha256", process.env.AUTH_SECRET)
    .update(value)
    .digest("hex");
}

export function createAgeToken() {
  const expiresAt = String(Date.now() + AGE_COOKIE_MAX_AGE * 1000);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifyAgeToken(token) {
  if (!token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;

  const expected = Buffer.from(sign(expiresAt));
  const received = Buffer.from(signature);
  if (expected.length !== received.length) return false;
  if (!timingSafeEqual(expected, received)) return false;

  return Number(expiresAt) > Date.now();
}
