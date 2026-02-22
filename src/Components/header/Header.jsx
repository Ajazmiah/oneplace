import React from "react";
import { auth } from "../../auth";


import Navigation from "./navigation/Navigation";

async function Header() {
  const session = await auth();

  const Allnavigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard/applications" },

    { name: "About", href: "/about" },

  ];
  const loggedInNavigation = [...Allnavigation];
  const loggedOutNavigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },

  ];

  const navigation = session?.user ? loggedInNavigation : loggedOutNavigation;

  return (
    <header className="sticky inset-x-0 top-0 z-50 transition-colors duration-300 bg-black">
      <Navigation navigation={navigation} session={session} />
    </header>
  );
}

export default Header;
