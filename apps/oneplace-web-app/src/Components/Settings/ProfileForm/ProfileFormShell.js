"use client";

import { createContext, startTransition, useActionState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { saveProfile } from "@/app/lib/actions/profile/profileActions";

const FieldErrorsContext = createContext({});

/**
 * Client wrapper for the profile form: runs saveProfile, shows the result as a toast and
 * shares field errors with <FieldError>. The sections are passed in as children, so they
 * still render on the server.
 */
export default function ProfileFormShell({ children }) {
  const [state, formAction, pending] = useActionState(saveProfile, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  // Submit through onSubmit instead of <form action>: React resets a form after an action
  // runs, which would wipe what the user typed whenever the save comes back with errors.
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <FieldErrorsContext.Provider value={state?.fieldErrors ?? {}}>
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Autofill profile"
        aria-busy={pending}
        className="flex flex-col gap-6"
      >
        {children}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-strong px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {pending ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </FieldErrorsContext.Provider>
  );
}

/**
 * Shows the save error for a field, if any. `name` is a field name from saveProfile's
 * fieldErrors (e.g. "email", "education.0.endDate"); pass an array to check several.
 */
export function FieldError({ name }) {
  const fieldErrors = useContext(FieldErrorsContext);
  const names = Array.isArray(name) ? name : [name];
  const message = names.map((n) => fieldErrors[n]).find(Boolean);

  if (!message) return null;
  return (
    <p role="alert" className="text-xs font-medium text-red-600">
      {message}
    </p>
  );
}
