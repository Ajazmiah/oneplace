"use client";

import { Input } from "@/Components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { FileText, X } from "lucide-react";
import { editApplication } from "@/app/lib/DataAccessLayer/applications";
import AlertDialogBox from "../AlertDialog/AlertDialog";

function ApplicationForm({ application = null }) {
  const [resume, setResume] = useState(application?.resume || null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [open, setOpen] = useState(false);

  const [jobTitle, setJobTitle] = useState(application?.jobTitle || "");
  const [companyName, setCompanyName] = useState(
    application?.companyName || ""
  );
  const [location, setLocation] = useState(application?.location || "");
  const [salaryRange, setSalaryRange] = useState(
    application?.salaryRange || ""
  );
  const [details, setDetails] = useState(application?.description || "");
  const [status, setStatus] = useState(application?.status || "applied");
  const [jobUrl, setJobUrl] = useState(application?.jobUrl || "");

  const router = useRouter();

  function handleFileUpload(e) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const file = e.target.files[0];
    if (!file) return;

    const { type } = file;
    const inputName = e.target.name;

    if (!allowedTypes.includes(type)) return;

    if (inputName === "resume") setResume(file);
    else setCoverLetter(file);
  }

  console.log("APPLICATION===", application)

  const getFormData = () => {
    const formData = new FormData();
    if (resume !== null) formData.append("resume", resume);
    if (coverLetter !== null) formData.append("coverLetter", coverLetter);
    formData.append("jobTitle", jobTitle);
    formData.append("status", status);
    formData.append("companyName", companyName);
    formData.append("location", location);
    formData.append("salaryRange", salaryRange);
    formData.append("details", details);
    formData.append("jobUrl", jobUrl);
    return formData;
  };

  let response;
  const handleConfirmed = async () => {
    const formData = getFormData();
    setOpen(false);
    response = await editApplication(application._id, formData);
    toast(response.message);
    router.back();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!jobTitle || !companyName) {
      return alert("Job title and company are required");
    }

    const formData = getFormData();

    if (!application) {
      const res = await fetch("/api/application/add-application", {
        method: "POST",
        body: formData,
      });
      response = await res.json();
    } else {
      setOpen(true);
    }

    if (!response?.success) {
      toast.error(response.message);
      return;
    }

    setResume(null);
    setCoverLetter(null);
    setJobTitle("");
    setCompanyName("");
    setLocation("");
    setSalaryRange("");
    setDetails("");
    setStatus("");
    setJobUrl("");
    localStorage.removeItem("application");
    application ? toast("Successfully edited") : toast("Application added");
    router.push("/dashboard/applications");
  }

  const isEditing = !!application;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <AlertDialogBox
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirmed}
        title="Are you sure you want to edit?"
      />

      {/* Page header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-[#0bbcaa]/25 bg-[#0bbcaa]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0bbcaa] animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#0bbcaa]">
            {isEditing ? "Edit application" : "New application"}
          </span>
        </div>
        <h1 className="font-bold tracking-tight text-gray-900 text-3xl sm:text-4xl leading-[1.08]">
          {isEditing ? "Update this " : "Log a new "}
          <span
            style={{
              background: "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            role.
          </span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {isEditing
            ? "Update the details below and save your changes."
            : "Fill in the details below to track this job application."}
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section: Role details */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Role details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Job Title <span className="text-[#0bbcaa]">*</span></label>
                <Input
                  name="jobTitle"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobTitle}
                  required
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Company <span className="text-[#0bbcaa]">*</span></label>
                <Input
                  name="company"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  required
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Location</label>
                <Input
                  name="location"
                  placeholder="e.g. London, UK / Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Job URL</label>
                <Input
                  name="URL"
                  placeholder="https://..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Salary Range</label>
                <Input
                  name="salaryRange"
                  placeholder="e.g. £60,000 – £80,000"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Status</label>
                <Select
                  name="status"
                  onValueChange={(value) => setStatus(value)}
                  defaultValue={status}
                >
                  <SelectTrigger className="focus:ring-[#0bbcaa]/40 focus:border-[#0bbcaa]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Section: Notes */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Notes
            </p>
            <Textarea
              name="notes"
              placeholder="Add any notes about the role, requirements, or interview process..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[120px] focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Section: Documents */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Documents
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "resume", label: "Resume", file: resume?.filename, clear: () => setResume(null) },
                { key: "coverLetter", label: "Cover Letter", file: coverLetter, clear: () => setCoverLetter(null) },
              ].map(({ key, label, file, clear }) => (
                <label
                  key={key}
                  className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition-colors ${
                    file
                      ? "border-[#0bbcaa]/50 bg-[#0bbcaa]/5"
                      : "border-gray-200 hover:border-[#0bbcaa]/40 hover:bg-[#0bbcaa]/5"
                  }`}
                >
                  <FileText
                    className={`w-6 h-6 ${file ? "text-[#0bbcaa]" : "text-gray-400"}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {file ? file : `Upload ${label}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      PDF, DOC, DOCX
                    </p>
                  </div>
                  {file && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); clear(); }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <input
                    name={key}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-lg bg-main px-6 py-3 text-sm font-semibold text-white hover:bg-main-light transition-colors"
            >
              {isEditing ? "Save Changes →" : "Save Application →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
