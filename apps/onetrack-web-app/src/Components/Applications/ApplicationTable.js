"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import Heading from "@/Components/ui/Heading";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { Search, Download, Plus, ChevronsUpDown, ListFilter } from "lucide-react";
import StatusCard from "./StatusCard";
import Application from "./Application";
import Pagination from "../Pagination/Pagination";
import usePagination from "@/hook/usePagination";

export default function ApplicationTable({ applications }) {
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("all");

  const {
    paginated,
    currentPage,
    totalPages,
    setCurrentPage,
    nextPage,
    prevPage,
  } = usePagination(filteredApplications, 7);

  const applicationStatus = applications.reduce(
    (counts, application) => {
      counts[application.status] = (counts[application.status] || 0) + 1;
      return counts;
    },
    { applied: 0,rejected: 0, interviewing: 0, offer: 0 }
  );

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

  return (
    <div className="rounded-2xl p-6 space-y-6">
      {/* Cards [applications , interviewing, offered , rejected] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
        <StatusCard
          applications={applications}
          applicationStatus={applicationStatus}
          setFilterByStatus={setFilterByStatus}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by job title or company..."
              className="pl-8 bg-white"
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>

          <Select onValueChange={(value) => setFilterByStatus(value)}>
            <SelectTrigger className="w-[180px] bg-white">
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
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="bg-white">
            <Download className="h-4 w-4" />
          </Button>
          <Button asChild className="bg-slate-900 hover:bg-slate-800">
            <Link href="/dashboard/add-application">
              <Plus className="h-4 w-4" />
              Add Application
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-brand/10">
              <th className="px-3 py-3">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Applications ({filteredApplications.length})
                  <ChevronsUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="px-3 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Company
                </span>
              </th>
              <th className="px-3 py-3 hidden md:table-cell">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                  <ListFilter className="h-3 w-3" />
                </span>
              </th>
              <th className="px-3 py-3 hidden md:table-cell">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date Applied
                </span>
              </th>
              <th className="px-3 py-3 text-right hidden md:table-cell">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Salary
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <Application filteredApplications={paginated} />
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    </div>
  );
}
