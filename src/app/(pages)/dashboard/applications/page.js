"use client";

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
import Sidebar from "@/components/Sidebar/Sidebar";

export default function JobApplicationsPage() {
  const applications = [
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
  ];

  const statusStyles = {
    interviewing: "bg-yellow-100 text-yellow-800",
    applied: "bg-blue-100 text-blue-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const APPLICATIONS = (
    <>
      <div>
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-gray-500">
          Track and manage your job application journey
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Applications</p>
            <p className="text-2xl font-bold">4</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Offers Received</p>
            <p className="text-2xl font-bold">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Rejections</p>
            <p className="text-2xl font-bold">1</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search jobs or companies..." className="pl-8" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
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
        {applications.map((app, idx) => (
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
