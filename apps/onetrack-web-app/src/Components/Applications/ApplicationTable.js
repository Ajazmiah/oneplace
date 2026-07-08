"use client";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import StatusCard from "./StatusCard";
import Application from "./Application";

export default function ApplicationTable({ applications }) {
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
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 7;

  //filter
  useEffect(() => {
    //checks if search query matches the searchFiled
    const queryExists = (searchFiled) =>
      searchFiled?.toLowerCase().includes(filterQuery.toLowerCase());

    let filtered;

    if (filterByStatus.trim() !== "all") {
      filtered = applications.filter(
        (application) => application.status === filterByStatus
      );
      console.log(filterByStatus);
    } else {
      filtered = applications.filter((application) => {
        if (
          queryExists(application.jobTitle) ||
          queryExists(application.companyName)
        ) {
          return true;
        }
      });
    }

    setFilteredApplications(filtered);
  }, [filterQuery, filterByStatus]);

  useEffect(() => {
    applications.forEach((application) => {
      setApplicationStatus((prev) => ({
        ...prev,
        [application.status]: prev[application.status] + 1,
      }));
    });
  }, [applications]);

  const totalPages = Math.ceil(filteredApplications.length / PAGE_SIZE);
  const paginated = filteredApplications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      <div>
        <p className="text-gray-500">
          Track and manage your job application journey
        </p>
      </div>

      {/* Cards [applications , interviewing, offered , rejected] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
        <StatusCard
          applications={applications}
          applicationStatus={applicationStatus}
        />
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
        <Application filteredApplications={paginated} query={filterQuery} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0bbcaa] hover:text-[#0bbcaa] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-[#0bbcaa] text-white"
                  : "border border-gray-200 text-gray-600 hover:border-[#0bbcaa] hover:text-[#0bbcaa]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0bbcaa] hover:text-[#0bbcaa] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
