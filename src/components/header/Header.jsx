import React from "react";
import { auth } from "../../auth";

import Navigation from "./navigation/Navigation";

async function header() {
  const session = await auth();

  const Allnavigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard/applications" },
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

  const navigation = session?.user ? loggedInNavigation : loggedOutNavigation;

  return (
    <header className="sticky inset-x-0 top-0 z-50 transition-colors duration-300 bg-black">
      <Navigation navigation={navigation} session={session} />
      <div class="border-t border-gray-700"></div>
    </header>
  );
}

export default header;
