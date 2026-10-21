"use client";

// TEMPORARY: Work-in-progress notice for pricing/payments.
// Payments aren't wired up yet — this pops up once when the Pricing page loads
// so employers/visitors know it's coming. Remove this whole file and its import
// in page.js once billing is live.

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// Headless UI's Dialog moves focus into the popup, keeps Tab inside it,
// closes on Esc or an outside click, and returns focus when it closes.
export default function WorkInProgressNotice() {
  const [open, setOpen] = useState(true);
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onClose={close} className="relative z-[100]">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
          >
            <svg className="size-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-5 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <svg className="size-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <DialogTitle as="h2" className="text-center text-xl font-bold text-gray-900">
            Pricing &amp; payments coming soon
          </DialogTitle>
          <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
            Billing and payment functionality is still a work in progress. The plans
            below are a preview — you can explore the app for free in the meantime.
          </p>

          {/* Focus starts here so Enter dismisses the notice */}
          <button
            type="button"
            autoFocus
            onClick={close}
            className="mt-6 w-full rounded-xl bg-brand-strong px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-brand-strong-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2"
          >
            Got it
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
