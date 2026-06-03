"use client";
import React, { useState } from "react";
import LoginButton from "../../ui/LoginButton";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "./DropDownMenu";

function Navigation({ navigation, session }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = session?.user || null;

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
            <a
              key={item.name}
              href={item.href}
              className="nav-link"
            >
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

            <LoginButton display="mobile" loggedIn={loggedIn} />
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}

export default Navigation;
