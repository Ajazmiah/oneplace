"use server";
import React from "react";
import { auth } from "../../auth"

import Navigation from "./navigation/Navigation";

async function header() {

  const session = await auth()

  const Allnavigation = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "#" },
    { name: "Features", href: "#" },
    { name: "About", href: "/about" },
    { name: "Company", href: "#" },
  ];
  const loggedInNavigation = [...Allnavigation];
  const loggedOutNavigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#" },
    { name: "About", href: "/about" },
    { name: "Company", href: "#" },
  ];

  const navigation =  session?.user ? loggedInNavigation : loggedOutNavigation

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Navigation navigation={navigation} session={session} />
    </header>
  );
}

export default header;
