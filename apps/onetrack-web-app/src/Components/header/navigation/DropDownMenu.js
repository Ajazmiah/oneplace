"use client";

import Avatar from "@/Components/Avatar/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import Logout from "@/Components/ui/logout";
import { logout } from "@/app/lib/actions/authentication/authenticationAction";
import Link from "next/link";

const itemClass =
  "cursor-pointer rounded-xl px-3 py-2.5 text-sm text-gray-600 gap-3 focus:bg-[#0bbcaa]/5 focus:text-[#0bbcaa] hover:bg-[#0bbcaa]/5 hover:text-[#0bbcaa] transition-colors";

export function Dropdown({ session }) {
  const user_name = session?.user?.name;
  const user_email = session?.user?.email;
  const user_image = session?.user?.image;

  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar session={session} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="w-64 rounded-2xl border border-gray-100 bg-white shadow-xl p-2"
        >
          {/* User header */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
              {user_image ? (
                <img
                  src={user_image}
                  alt={user_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
                  }}
                >
                  {user_name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user_name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user_email}</p>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-gray-100 my-1" />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild className={itemClass}>
              <Link href="/profile" className="flex items-center gap-3">
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className={itemClass}>
              <Link
                href="/dashboard/applications"
                className="flex items-center gap-3"
              >
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Dashboard
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-gray-100 my-1" />
          <Logout />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
