"use client";

import { logout } from "@/app/lib/actions/authentication/authenticationAction";
import { notifyExtension } from "@/app/lib/utils/notifyExtension";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import React from "react";

// Must be a menu item (not a plain div) so keyboard and screen reader users can reach it
function Logout() {
  const handleLogout = () => {
    notifyExtension({ type: "AUTH_STATE", user: null });
    logout();
  };

  return (
    <DropdownMenuItem
      onSelect={handleLogout}
      className="flex w-full items-center cursor-pointer rounded-xl px-3 py-2.5 text-sm text-gray-500 gap-3 focus:bg-red-50 focus:text-red-500 hover:bg-red-50 hover:text-red-500 transition-colors"
    >
      <svg
        className="w-4 h-4 flex-shrink-0 text-current"
        aria-hidden="true"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
        />
      </svg>
      Sign out
    </DropdownMenuItem>
  );
}

export default Logout;
