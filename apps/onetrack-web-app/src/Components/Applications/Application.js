import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { formatDate } from "@/app/lib/utils/utils";

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
];

function avatarColor(name) {
  const code = name?.charCodeAt(0) ?? 0;
  return avatarColors[code % avatarColors.length];
}

function Application({ filteredApplications }) {
  return (
    <>
      {filteredApplications.map((app, index) => (
        <tr
          key={app._id}
          className={`border-b border-gray-50 last:border-0 transition-colors hover:bg-brand/5 ${
            index % 2 === 1 ? "bg-[#FBF8F3]" : "bg-white"
          }`}
        >
          <td className="px-3 py-4">
            <Link href={`applications/${app._id}`} className="flex items-center gap-3 group">
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${avatarColor(
                  app.companyName
                )}`}
              >
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 group-hover:text-brand group-hover:underline">
                  {app.jobTitle}
                </p>
                <p className="text-sm text-gray-500">{app.location || "—"}</p>
              </div>
            </Link>
          </td>

          <td className="px-3 py-4 text-sm text-slate-700">{app.companyName}</td>

          <td className="px-3 py-4">
            <span className={`badge badge-${app.status}`}>{app.status}</span>
          </td>

          <td className="px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
            {formatDate(app.createdAt)}
          </td>

          <td className="px-3 py-4 hidden lg:table-cell">
            <div className="flex items-center gap-1.5">
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                  app.resume ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"
                }`}
              >
                Resume
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                  app.coverLetter ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"
                }`}
              >
                Cover Letter
              </span>
            </div>
          </td>

          <td className="px-3 py-4 text-right text-sm font-semibold text-slate-800">
            {app.salaryRange || "—"}
          </td>
        </tr>
      ))}
    </>
  );
}

export default Application;
