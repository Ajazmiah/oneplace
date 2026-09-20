import React from "react";
import { auth } from "../../auth";

import Navigation from "./navigation/Navigation";

async function Header() {
  const session = await auth();

  const Allnavigation = [
    { name: "Dashboard", href: "/dashboard/applications" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  const userNavigationItems = [
    { name: "Profile", href: "/profile" },
    { name: "Dashboard", href: "/dashboard/applications" },
    { name: "Settings", href: "/dashboard/settings" },
  ];
  // const loggedInNavigation = [
  //   { name: "Dashboard", href: "/dashboard/applications" },

  //   { name: "About", href: "/about" },
  // ];
  const loggedOutNavigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
  ];

  const navigation = session?.user ? Allnavigation : loggedOutNavigation;

  return (
    <header className="sticky inset-x-0 top-0 z-50 transition-colors duration-300 bg-white border-b border-gray-100 rounded-[30px] shadow-none">
      <Navigation
        navigation={navigation}
        session={session}
        userNavigations={userNavigationItems}
      />
    </header>
  );
}

export default Header;
