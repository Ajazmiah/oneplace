"use client";
import React, { useState } from "react";
import LoginButton from "../../ui/LoginButton";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "./DropDownMenu";
import Link from "next/link";
import Logout from "@/Components/ui/logout";

function Navigation({ navigation, session, userNavigations }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = session?.user || null;

  const itemClass =
    "cursor-pointer rounded-xl px-3 py-2.5 text-sm text-gray-600 gap-3 focus:bg-[#0bbcaa]/5 focus:text-[#0bbcaa] hover:bg-[#0bbcaa]/5 hover:text-[#0bbcaa] transition-colors";

  return (
    <>
      <nav
        className="flex items-center justify-between py-4 px-6 lg:px-10"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a href="/" className="flex items-center">
            <img
              src="/oneplace-logo-full.svg"
              alt="OnePlace"
              className="h-10 w-auto"
            />
          </a>
        </div>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-600 hover:text-brand transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="size-6 cursor-pointer" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop nav links — centered */}
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="nav-link">
              {item.name}
            </a>
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
            <a href="/" onClick={() => setMobileMenuOpen(false)}>
              <img
                src="/oneplace-logo-full.svg"
                alt="OnePlace"
                className="h-10 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
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
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-link"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-gray-100" />
            {userNavigations.map((navigation) => {
              return (
                <div
                  className={itemClass}
                  key={navigation.name}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link
                    href={navigation?.href}
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
                    {navigation.name}
                  </Link>
                </div>
              );
            })}
            <div className="flex items-center gap-3 w-full">
              <Logout />
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}

export default Navigation;
