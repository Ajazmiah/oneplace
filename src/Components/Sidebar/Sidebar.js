"use client";
import React from "react";
import { Button } from "../ui/button";

import { usePathname } from "next/navigation";

import { PlusCircle, FileText, MessageSquareText,ClipboardList } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const dashboardNav = ["applications", "add-application", "application-answers", "add-answers"];
  const dashboardNavIcon = {
    applications: <FileText className="h-5 w-4" />,
    ["add-application"]: <PlusCircle className="h-5 w-4" />,
    ["application-answers"]: <ClipboardList className="h-5 w-4" />,
    ["add-answers"] : <MessageSquareText className="h-5 w-4" />,
  };

  return (
    <>
      <aside className="w-64 bg-white border-r p-6 space-y-6">
        <nav className="space-y-3">
          {dashboardNav.map((nav) => {
            const rootPath = pathname.split("/")[0];
            console.log("ROOT__PATH", rootPath);

            return (
              <Button
                variant={
                  pathname.endsWith(nav) ? "dashboardActive" : "dashboard"
                }
                className="w-full justify-start "
                key={nav}
              >
                <Link
                  key={nav}
                  href={`${rootPath}/dashboard/${nav}`}
                  className="flex w-full items-center gap-[5px]"
                >
                  {dashboardNavIcon[nav]}
                  {nav}
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
