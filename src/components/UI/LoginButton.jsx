"use client";
import React from "react";
import { Button } from '@headlessui/react'
import {
  login,
  logout,
} from "@/app/lib/actions/authentication/authenticationAction";

function LoginButton({ display, loggedIn }) {
  const isMobile = display === "mobile";

  const authText = loggedIn ? "Sign Out" : "Sign In";
  const backgroundColor = loggedIn ? 'bg-black data-hover:bg-gray-900': 'bg-main data-hover:bg-main-light'

  const authFunction = loggedIn ? logout : login;



  if (isMobile) {
    <button type="submit" onClick={authFunction}>
      {authText}
    </button>;
  }

  return (
    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
      <Button type="submit" onClick={authFunction}  className={`inline-flex items-center gap-2 rounded-md ${backgroundColor} px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white hover:cursor-pointer`}>
        {authText}
      </Button>
    </div>
  );
}

export default LoginButton;
