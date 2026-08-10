"use client";
import React, { useState } from "react";
import LoginButton from "../../ui/LoginButton";
import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { Dropdown } from "./DropDownMenu";
import UserNavigation from "./UserNavigation";
import Link from "next/link";
import { login } from "@/app/lib/actions/authentication/authenticationAction";

function Navigation({ navigation, session, userNavigations = [] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = session?.user || null;

  const itemClass =
    "cursor-pointer rounded-xl px-3 py-2.5 text-sm text-gray-600 gap-3 focus:bg-[#0bbcaa]/5 focus:text-[#0bbcaa] hover:bg-[#0bbcaa]/5 hover:text-[#0bbcaa] transition-colors";

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        className="flex items-center justify-between py-4 px-5"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center">
            <img
              src="/oneplace-logo-full.svg"
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
          className="-m-2.5 rounded-md p-2.5 text-gray-600 hover:text-[#0bbcaa] transition-colors lg:hidden"
        >
          <span className="sr-only">Open menu</span>
          <Bars3Icon className="size-6" aria-hidden="true" />
        </button>
      </nav>

      {/* Thin teal accent line */}
      <div className="divider-brand" />

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
