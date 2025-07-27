"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, ExternalLink } from "lucide-react";

export default function JobApplicationsPage() {
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("all");
  console.log("v", filterQuery);

  const applications = useMemo(() => [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      position: "Full-time",
      salary: "$120,000 - $150,000",
      status: "interviewing",
      date: "Dec 19",
    },
    {
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      position: "Full-time",
      salary: "$100,000 - $130,000",
      status: "applied",
      date: "Dec 17",
    },
    {
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      position: "Contract",
      salary: "$80,000 - $100,000",
      status: "offer",
      date: "Dec 14",
    },
    {
      title: "Software Engineer",
      company: "BigTech Inc",
      location: "Seattle, WA",
      position: "Full-time",
      salary: "$140,000 - $180,000",
      status: "rejected",
      date: "Dec 9",
    },
    {
      title: "Frontend Engineer",
      company: "NextGen Solutions",
      location: "Austin, TX",
      position: "Full-time",
      salary: "$110,000 - $140,000",
      status: "applied",
      date: "Dec 7",
    },
    {
      title: "Backend Developer",
      company: "Cloudify",
      location: "Denver, CO",
      position: "Remote",
      salary: "$115,000 - $145,000",
      status: "interviewing",
      date: "Dec 5",
    },
    {
      title: "Technical Project Manager",
      company: "EnterpriseSoft",
      location: "Chicago, IL",
      position: "Full-time",
      salary: "$105,000 - $125,000",
      status: "rejected",
      date: "Dec 2",
    },
  ], []);


  const status = {
    rejected: 0,
    interviewing: 0,
    offer: 0,
    applied:0
  }

  const [applicationStatus, setApplicationStatus] = useState(status)
  useEffect(() => {
    applications.forEach(application => {
      setApplicationStatus(prev => ({
        ...prev,
        [application.status]: (prev[application.status] || 0) + 1,
      }));
    });
  }, [applications]);
  
  //filter
  useEffect(() => {
    //checks if search query matches the searchFiled
    const queryExists = (searchFiled) =>
      searchFiled.toLowerCase().includes(filterQuery.toLowerCase());

    let filtered = [...applications];

    if (filterByStatus.trim() !== "all") {
      filtered = filtered.filter((application) =>
        application.status.includes(filterByStatus)
      );
    }
    filtered = filtered.filter((application) => {
      if (queryExists(application.title)) {
        return true;
      } else if (queryExists(application.company)) {
        return true;
      }
    });

    setFilteredApplications(filtered);
  }, [filterQuery, filterByStatus]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Applied / Number of Application </p>
            <p className="text-2xl font-bold">{applicationStatus.applied} / {applications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Interviewing</p>
            <p className="text-2xl font-bold">{applicationStatus.interviewing}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Offers Received</p>
            <p className="text-2xl font-bold">{applicationStatus.offer}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Rejections</p>
            <p className="text-2xl font-bold">{applicationStatus['rejected']}</p>
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
          <div
            key={idx}
            className="flex flex-wrap lg:flex-nowrap justify-between items-center bg-white shadow-sm rounded-lg p-4 border"
          >
            <div className="w-full lg:w-1/5 mb-2 lg:mb-0">
              <p className="font-semibold">{app.title}</p>
              <p className="text-sm text-gray-500">
                {app.company} · {app.location}
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
            <div className="w-1/6 text-sm text-gray-500">📅 {app.date}</div>
            <div className="w-1/6 text-sm text-gray-500 hidden md:block">
              No resume
            </div>
            <div className="w-1/6 text-sm text-gray-500 hidden md:block">
              No cover letter
            </div>
            <div className="w-10">
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return <>{APPLICATIONS}</>;
}
