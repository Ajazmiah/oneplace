"use client";
import React from "react";
import { Button } from "@/components/ui/button";

import { usePathname, useSearchParams } from "next/navigation";

import { PlusCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ clickHandler }) {
  const pathname = usePathname();

  const dashboardNav = ["applications", "add-application"];
  const dashboardNavIcon = {
    applications: <FileText className="h-5 w-4" />,
    ["add-application"]: <PlusCircle className="h-5 w-4" />,
  };



  return (
    <>
      <aside className="w-64 bg-white border-r p-6 space-y-6">
        <div className="text-xl font-semibold">JobTracker</div>
        <nav className="space-y-3">
          {dashboardNav.map((nav) => (
            <Button
              variant={pathname.endsWith(nav)? "dashboardActive" : "dashboard"}
              className="w-full justify-start "
            >
              <Link
                key={nav}
                href={nav}
                className="flex items-center gap-[5px]"
              >
                {dashboardNavIcon[nav]}
                {nav}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
    </>
  );
}
