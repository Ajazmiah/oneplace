"use client";
import React, { useState } from "react";
import LoginButton from "../../ui/LoginButton";
import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { Dropdown } from "./DropDownMenu";
import UserNavigation from "./UserNavigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { login } from "@/app/lib/actions/authentication/authenticationAction";

const DARK_HEADER_PATHS = ["/"];

function Navigation({ navigation, session, userNavigations = [] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = session?.user || null;
  // Header blends into the dark hero on these pages
  const isDark = DARK_HEADER_PATHS.includes(usePathname());

  const itemClass = `cursor-pointer rounded-xl px-3 py-2.5 text-sm gap-3 transition-colors ${
    isDark
      ? "text-white/85 hover:bg-white/10 hover:text-brand focus:bg-white/10 focus:text-brand"
      : "text-gray-600 focus:bg-[#0bbcaa]/5 focus:text-[#0bbcaa] hover:bg-[#0bbcaa]/5 hover:text-[#0bbcaa]"
  }`;

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`flex items-center justify-between py-4 px-5 ${
          isDark
            ? // Bleed the color past the layout padding to the top, left and right edges
              "bg-[#085041] shadow-[0_0_0_100vmax_#085041] [clip-path:inset(-100vmax_-100vmax_0)]"
            : "bg-white border-b border-gray-100"
        }`}
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center">
            <img
              src={isDark ? "/oneplace-logo-full-light.svg" : "/oneplace-logo-full.svg"}
              alt="OnePlace"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className={itemClass}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop right: avatar or sign in */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {session ? (
            <Dropdown loggedIn={loggedIn} session={session} />
          ) : (
            <LoginButton display="desktop" loggedIn={loggedIn} />
          )}
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={`-m-2.5 rounded-md p-2.5 hover:text-[#0bbcaa] transition-colors lg:hidden ${
            isDark ? "text-white" : "text-gray-600"
          }`}
        >
          <span className="sr-only">Open menu</span>
          <Bars3Icon className="size-6" aria-hidden="true" />
        </button>
      </nav>

      {/* Thin teal accent line */}
      <div
        className={
          isDark
            ? "bg-[#085041] shadow-[0_0_0_100vmax_#085041] [clip-path:inset(0_-100vmax)]"
            : "bg-white"
        }
      >
        <div className="divider-brand" />
      </div>

      {/* Mobile drawer */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-5 sm:max-w-sm shadow-xl">
          {/* Drawer header */}
          <div className="flex items-center justify-between">
            <Link href="/" onClick={closeMenu}>
              <img
                src="/oneplace-logo-full.svg"
                alt="OnePlace"
                className="h-10 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="-m-2.5 rounded-md p-2.5 text-gray-500 hover:text-brand transition-colors"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="size-6 cursor-pointer" aria-hidden="true" />
            </button>
          </div>

          {/* Drawer links */}
          <div className="mt-8 flow-root">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Divider between app nav and user nav */}
            <div className="my-4 h-px bg-gray-100" />

            {loggedIn ? (
              <UserNavigation
                session={session}
                userNavigations={userNavigations}
                onNavigate={closeMenu}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  login();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-main px-3 py-2.5 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-main-light transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}

export default Navigation;
