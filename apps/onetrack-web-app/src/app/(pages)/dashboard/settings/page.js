"use client";

import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Github, Linkedin, Globe, Twitter, Trash2, AlertTriangle } from "lucide-react";
import AlertDialogBox from "@/Components/AlertDialog/AlertDialog";

const socialFields = [
  {
    name: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    name: "twitter",
    label: "X / Twitter",
    icon: Twitter,
    placeholder: "https://x.com/username",
  },
  {
    name: "website",
    label: "Website",
    icon: Globe,
    placeholder: "https://yourdomain.com",
  },
];

export default function SettingsPage() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [socialLinks, setSocialLinks] = useState(
    socialFields.map(({ name }) => ({ socialLabel: name, url: "" }))
  );

  const handleChange = (name, value) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.socialLabel === name ? { ...link, url: value } : link
      )
    );
  };

  const handleSave = () => {
    // only the links the user actually filled in
    const filled = socialLinks.filter((link) => link.url.trim() !== "");
    console.log(filled);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3.5 py-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-brand" />
          <span className="text-xs font-semibold uppercase tracking-widest text-brand">
            Settings
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Account settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your connected profiles and account preferences.
        </p>
      </div>

      {/* Social media card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
          Social profiles
        </p>
        <div className="grid grid-cols-1 gap-4">
          {socialFields.map(({ name, label, icon: Icon, placeholder }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <Icon className="h-3.5 w-3.5 text-gray-400" />
                {label}
              </label>
              <Input
                name={name}
                placeholder={placeholder}
                onChange={(e) => handleChange(name, e.target.value)}
                className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                value={
                  socialLinks.find((link) => link.socialLabel === name)?.url ?? ""
                }
              />
            </div>
          ))}
        </div>


        <div className="flex items-center justify-end pt-6">
          <button
          onClick={handleSave}
            type="button"
            className="rounded-lg bg-main px-6 py-3 text-sm font-semibold text-white hover:bg-main-light transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Danger zone card */}
      <div className="mt-8 bg-white rounded-2xl border border-red-200 shadow-sm p-6 sm:p-8">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-red-500 mb-4">
          <AlertTriangle className="h-3.5 w-3.5" />
          Danger zone
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Delete account</p>
            <p className="text-sm text-gray-500">
              Permanently remove your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog (UI only) */}
      <AlertDialogBox
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => setConfirmDelete(false)}
        title="Are you sure you want to delete your account?"
        description="This action cannot be undone. This will permanently delete your account and remove all your data."
      />
    </div>
  );
}
