import { logout } from "@/app/lib/actions/authentication/authenticationAction";
import React from "react";

function Logout() {
  return (
    <div className="flex w-full p-[12px] items-center cursor-pointer rounded-xl px-3 py-2.5 text-sm text-gray-500 gap-3 focus:bg-red-50 focus:text-red-500 hover:bg-red-50 hover:text-red-500 transition-colors" onClick={logout}>
      <svg
        className="w-4 h-4 flex-shrink-0"
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
    </div>
  );
}

export default Logout;
