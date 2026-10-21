"use client";
import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyAgeAndSignIn } from "@/app/lib/actions/authentication/ageAction";

// Keep in sync with isValidAge / AGE_ERROR in lib/utils/ageVerification.js
const AGE_ERROR = "You must be 18 or older to create an account.";
const isValidAge = (age) => {
  if (age.trim() === "") return false;
  const value = Number(age);
  return Number.isInteger(value) && value >= 18 && value <= 120;
};

const PROVIDER_NAMES = { google: "Google", github: "GitHub" };

export default function ConfirmAgePage() {
  return (
    <Suspense>
      <ConfirmAgeContent />
    </Suspense>
  );
}

function ConfirmAgeContent() {
  const provider = useSearchParams().get("provider");
  const providerName = PROVIDER_NAMES[provider];
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidAge(age)) {
      setError(AGE_ERROR);
      return;
    }

    startTransition(async () => {
      // Sets the signed age cookie and restarts the OAuth sign-in,
      // which creates the account on its second pass
      const result = await verifyAgeAndSignIn(provider, age);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    // -mt-6 cancels the layout's space-y-6; shadow + clip-path bleed the color edge to edge
    <main className="min-h-screen -mt-6 flex items-center justify-center px-6 py-16 bg-[#085041] shadow-[0_0_0_100vmax_#085041] [clip-path:inset(0_-100vmax)]">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
          Create account
        </p>
        <h1 className="font-bold text-gray-900 text-2xl tracking-tight">
          Confirm your age
        </h1>

        {!providerName ? (
          <p className="text-sm text-gray-500 mt-4">
            Something went wrong.{" "}
            <Link
              href="/signin"
              className="text-[#0bbcaa] font-semibold hover:text-[#085041] transition-colors"
            >
              Back to sign in →
            </Link>
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              You need to be 18 or older to create an account with your{" "}
              {providerName} login.
            </p>

            {error && (
              <div
                role="alert"
                className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100"
              >
                <p className="text-xs text-red-500 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="age" className="block text-sm text-gray-700">
                How old are you?
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                placeholder="Age"
                required
                autoFocus
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0bbcaa]/40 focus:border-[#0bbcaa] transition-colors"
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-strong text-white py-3 rounded-lg text-sm font-semibold hover:bg-brand-strong-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Continuing…" : "Continue"}
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-6 text-center">
              <Link
                href="/"
                className="text-[#0bbcaa] font-semibold hover:text-[#085041] transition-colors"
              >
                Cancel
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
