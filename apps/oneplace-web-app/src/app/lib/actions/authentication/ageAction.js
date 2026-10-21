"use server";
import { cookies } from "next/headers";
import { signIn } from "@/auth";
import {
  AGE_COOKIE,
  AGE_COOKIE_MAX_AGE,
  AGE_ERROR,
  createAgeToken,
  isValidAge,
} from "@/app/lib/utils/ageVerification";

const ALLOWED_PROVIDERS = ["google", "github"];

export async function verifyAgeAndSignIn(provider, age) {
  if (!isValidAge(age)) {
    return { error: AGE_ERROR };
  }
  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return { error: "Unknown sign-in provider" };
  }

  const cookieStore = await cookies();
  cookieStore.set(AGE_COOKIE, createAgeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AGE_COOKIE_MAX_AGE,
  });

  // signIn throws a redirect to the provider, so it must run last
  await signIn(provider, { redirectTo: "/dashboard/applications" });
}
