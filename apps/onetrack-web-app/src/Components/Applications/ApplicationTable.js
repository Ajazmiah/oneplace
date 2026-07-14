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

import { Search } from "lucide-react";
import StatusCard from "./StatusCard";
import Application from "./Application";
import Pagination from "../Pagination/Pagination";
import usePagination from "@/hook/usePagination";

export default function ApplicationTable({ applications }) {
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("all");

  const status = {
    rejected: 0,
    interviewing: 0,
    offer: 0,
    applied: 0,
  };

  const {
    paginated,
    currentPage,
    totalPages,
    setCurrentPage,
    nextPage,
    prevPage,
  } = usePagination(filteredApplications, 7);

  const [applicationStatus, setApplicationStatus] = useState(status);

  // filter
  useEffect(() => {
    const queryExists = (searchFiled) =>
      searchFiled?.toLowerCase().includes(filterQuery.toLowerCase());

    let filtered;

    if (filterByStatus.trim() !== "all") {
      filtered = applications.filter(
        (application) => application.status === filterByStatus
      );
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    </>
  );
}