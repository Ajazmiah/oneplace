"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { Search } from "lucide-react";
import { formatDate } from "@/app/lib/utils/utils";
import Link from "next/link";

export default function ApplicationTable({ applications}) {
 
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("all");
  console.log("v", filterQuery);

  const status = {
    rejected: 0,
    interviewing: 0,
    offer: 0,
    applied: 0,
  };

  const [applicationStatus, setApplicationStatus] = useState(status);

  //filter
  useEffect(() => {
    //checks if search query matches the searchFiled
    const queryExists = (searchFiled) =>
      searchFiled?.toLowerCase().includes(filterQuery.toLowerCase());

    let filtered = [...applications];

    if (filterByStatus.trim() !== "all") {
      filtered = filtered.filter((application) =>
        application.status.includes(filterByStatus)
      );
    }
    filtered = filtered.filter((application) => {
      if (queryExists(application.jobTitle)) {
        return true;
      } else if (queryExists(application.company)) {
        return true;
      }
    });

    setFilteredApplications(filtered);
  }, [filterQuery, filterByStatus, applications]);
  useEffect(() => {
    applications.forEach((application) => {
      setApplicationStatus((prev) => ({
        ...prev,
        [application.status]: prev[application.status] + 1,
      }));
    });
  }, [applications]);

  const statusStyles = {
    interviewing: "bg-yellow-100 text-yellow-800",
    applied: "bg-blue-100 text-blue-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const APPLICATIONS = (
    <>
      <div>
        <p className="text-gray-500">
          Track and manage your job application journey
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">
             Applications
            </p>
            <p className="text-2xl font-bold">
              {`${applications.length}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Interviewing</p>
            <p className="text-2xl font-bold">
              {applicationStatus.interviewing}
            </p>
          </CardContent>
        </Card>
        <Card className=''>
          <CardContent className="p-4">
            <p className="text-sm">Offers Received</p>
            <p className="text-2xl font-bold">{applicationStatus.offer}</p>
          </CardContent>
        </Card>
        <Card >
          <CardContent className="p-4">
            <p className="text-sm">Rejections</p>
            <p className="text-2xl font-bold">
              {applicationStatus["rejected"]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs or companies..."
            className="pl-8"
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => setFilterByStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">Export CSV</Button>
      </div>

      {/* Application Table */}
  
      <div className="space-y-2">
        {filteredApplications.map((app, idx) => (
          <Link 
            href={`applications/${app._id}`}
            key={app._id}
            className="flex flex-wrap lg:flex-nowrap justify-between items-center bg-white shadow-sm rounded-lg p-4 border"
          >
            <div className="w-full lg:w-1/5 mb-2 lg:mb-0">
              <p className="font-semibold">{app.jobTitle}</p>
              <p className="text-sm text-gray-500">
                {app.companyName} · {app.location}
              </p>
            </div>
            <div className="w-1/6 text-sm text-gray-700">{app.position}</div>
            <div className="w-1/6 text-sm text-gray-700">{app.salary}</div>
            <div className="w-1/6">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  statusStyles[app.status]
                }`}
              >
                {app.status}
              </span>
            </div>
            <div className="w-1/6 text-sm text-gray-500">📅 {formatDate(app.createdAt)}</div>
            <div className="w-1/6 text-sm text-gray-500 hidden md:block">
              Resume
            </div>
            <div className="w-1/6 text-sm text-gray-500 hidden md:block">
              Cover Letter
            </div>
           
          </Link>
        ))}
      </div>
      
    </>
  );

  return <>{APPLICATIONS}</>;
}
