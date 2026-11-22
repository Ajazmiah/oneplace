"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import AlertDialogBox from "@/Components/AlertDialog/AlertDialog";
import { deleteAccount } from "@/app/lib/DataAccessLayer/account";
import { notifyExtension } from "@/app/lib/utils/notifyExtension";

export default function DangerZone() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    localStorage.clear();
    notifyExtension({ type: "AUTH_STATE", user: null });

    const res = await deleteAccount();

    // deleteAccount redirects on success, so this only runs on failure
    if (res && !res.success) {
      toast.error(res.message);
    }
    setDeletingAccount(false);
    setConfirmDelete(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 sm:p-8">
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
            disabled={deletingAccount}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            {deletingAccount ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialogBox
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDeleteAccount}
        title="Are you sure you want to delete your account?"
        description="This action cannot be undone. This will permanently delete your account and remove all your data."
      />
    </>
  );
}
