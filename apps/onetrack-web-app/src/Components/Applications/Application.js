import React from "react";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils/utils";
import { Search } from "lucide-react";

function Application({ filteredApplications,query }) {

  return (
    <>
      {filteredApplications.map((app) => (
        <Link
          href={`applications/${app._id}`}
          key={app._id}
          className="flex flex-wrap lg:flex-nowrap justify-between items-center bg-surface shadow-sm rounded-lg p-4 border border-gray-100"
        >
          <div className="w-full lg:w-1/5 mb-2 lg:mb-0">
            <p className="font-semibold">{app.jobTitle.split("").map((t, i) => <p key={i} style={{ color: `${query.includes(t)? 'red': ''}`, display: 'inline'}}>{t}</p>)}</p>
            <p className="text-sm text-gray-500">
              {app.companyName} · {app.location}
            </p>
          </div>
          <div className="w-1/6 text-sm text-gray-700">{app.position}</div>
          <div className="w-1/6 text-sm text-gray-700">{app.salary}</div>
          <div className="w-1/6">
            <span
              className={`badge badge-${app.status}`}
            >
              {app.status}
            </span>
          </div>
          <div className="w-1/6 text-sm text-gray-500">
            📅 {formatDate(app.createdAt)}
          </div>
          <div className="w-1/6 text-sm text-gray-500 hidden md:block">
            {app?.resume ? "View Resume" : "No Resume"}
          </div>
          <div className="w-1/6 text-sm text-gray-500 hidden md:block">
            {app?.coverLetter ? "View Cover Letter" : "No Cover Letter"}
          </div>
        </Link>
      ))}
    </>
  );
}

export default Application;
