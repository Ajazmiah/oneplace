"use client";
import { usePathname } from "next/navigation";
import { PlusCircle, FileText, MessageSquareText, ClipboardList } from "lucide-react";
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

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0f172a] flex flex-col">
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#0bbcaa] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">Resumind</span>
        </div>
      </div>

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
  );
}
