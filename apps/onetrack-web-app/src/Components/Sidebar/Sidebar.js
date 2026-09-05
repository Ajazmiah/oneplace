"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { PlusCircle, FileText, MessageSquareText, ClipboardList, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/add-application", label: "New Application", icon: PlusCircle },
  { href: "/dashboard/interview-answers", label: "Interview Prep", icon: ClipboardList },
  { href: "/dashboard/add-interview-answer", label: "New Question", icon: MessageSquareText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopExpanded, setDesktopExpanded] = useState(false);

  return (
    <>
      {/* Pull-tab — only on mobile, slides away when sidebar opens */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className={cn(
          "fixed left-0 top-1/2 -translate-y-1/2 z-40 lg:hidden",
          "bg-brand text-white rounded-r-xl px-1.5 py-4 shadow-lg",
          "flex flex-col items-center gap-1.5 transition-transform duration-300",
          mobileOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <Menu className="h-4 w-4" />
        <span
          className="text-[9px] font-semibold tracking-widest uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Menu
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 flex-shrink-0 flex flex-col",
          "bg-white lg:bg-transparent",
          "transform transition-[transform,width] duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:z-auto",
          desktopExpanded ? "lg:w-56" : "lg:w-16"
        )}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-white/[0.07] flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1 rounded"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            onClick={() => setDesktopExpanded((v) => !v)}
            aria-label={desktopExpanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={desktopExpanded}
            className="hidden lg:flex text-slate-500 hover:text-brand transition-colors p-1 rounded mx-auto"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p
            className={cn(
              "px-3 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest",
              "whitespace-nowrap overflow-hidden transition-all duration-300",
              !desktopExpanded && "lg:max-h-0 lg:pb-0 lg:opacity-0"
            )}
          >
            dashboard menu
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => {
                  setMobileOpen(false);
                  setDesktopExpanded(true);
                }}
                aria-label={label}
                title={label}
                className={cn(
                  "sidebar-link",
                  isActive && "sidebar-link-active"
                )}
              >
                <Icon
                  className={cn(
                    "sidebar-icon",
                    isActive && "sidebar-icon-active"
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap overflow-hidden transition-all duration-300",
                    desktopExpanded ? "lg:max-w-[160px] lg:opacity-100" : "lg:max-w-0 lg:opacity-0"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "px-5 py-4 border-t border-white/[0.07]",
            "whitespace-nowrap overflow-hidden transition-all duration-300",
            !desktopExpanded && "lg:max-h-0 lg:py-0 lg:opacity-0"
          )}
        >
          <p className="text-[11px] text-slate-600">Resumind © 2025</p>
        </div>
      </aside>
    </>
  );
}
