"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { PlusCircle, FileText, MessageSquareText, ClipboardList, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/add-application", label: "New Application", icon: PlusCircle },
  { href: "/dashboard/interview-answers", label: "Interview Prep", icon: ClipboardList },
  { href: "/dashboard/add-interview-answer", label: "Add Answer", icon: MessageSquareText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Pull-tab — only on mobile, slides away when sidebar opens */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className={cn(
          "fixed left-0 top-1/2 -translate-y-1/2 z-40 lg:hidden",
          "bg-[#0bbcaa] text-white rounded-r-xl px-1.5 py-4 shadow-lg",
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
          "fixed inset-y-0 left-0 z-50 w-56 flex-shrink-0 bg-[#0f172a] flex flex-col",
          "transform transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:z-auto"
        )}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#0bbcaa] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">Resumind</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
            Workspace
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150",
                  isActive
                    ? "bg-[#0bbcaa]/15 text-[#0bbcaa] font-medium"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                )}
              >
                <Icon
                  className={cn(
                    "h-[15px] w-[15px] flex-shrink-0",
                    isActive ? "text-[#0bbcaa]" : "text-slate-500"
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-white/[0.07]">
          <p className="text-[11px] text-slate-600">Resumind © 2025</p>
        </div>
      </aside>
    </>
  );
}
