"use client";

import { Input } from "@/Components/ui/input";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Textarea } from "@/Components/ui/textarea";
import { FileText, X, ChevronDown, Upload } from "lucide-react";
import ApplicationFormHeader from "./ApplicationFormHeader";
function ApplicationForm() {
  const [resume, setResume] = useState(null);
  const [defaultResume, setDefaultResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const resumeInputRef = useRef(null);

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("applied");
  const [jobUrl, setJobUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  function handleFileUpload(e) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const file = e.target.files[0];
    if (!file || !allowedTypes.includes(file.type)) return;

    if (e.target.name === "resume") {
      setResume(file);
    } else {
      setCoverLetter(file);
    }
  }

  const getDfaultResume = async () => {
    const res = await fetch("/api/default-resume");
    const savedDefaultResume = await res.json();
    const resumeData = savedDefaultResume?.resumeData.resume;
    console.log("DAAA", resumeData);
    setDefaultResume(resumeData);
  };

  useEffect(() => {
    getDfaultResume();
  }, []);

  const getFormData = () => {
    const formData = new FormData();
    if (!resume) {
      formData.append("useDefaultResume", "true");
    } else if (resume instanceof File) {
      formData.append("resume", resume);
    }
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!jobTitle || !companyName) {
      setError("Job title and company are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = getFormData();
      const res = await fetch("/api/application/add-application", {
        method: "POST",
        body: formData,
      });
      const response = await res.json();

      if (!response?.success) {
        setError(response.message || "Something went wrong");
        return;
      }
      toast("Application added");
      setJobTitle("");
      setCompanyName("");
      setLocation("");
      setSalaryRange("");
      setDetails("");
      setStatus("");
      setJobUrl("");
      setError("");
      router.push("/dashboard/applications");
    } catch (err) {
      setError("Network error — please try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Page header */}
      <ApplicationFormHeader header={"add application"} />

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
                <label className="text-xs font-medium text-gray-600">
                  Job Title <span className="text-[#0bbcaa]">*</span>
                </label>
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
                <label className="text-xs font-medium text-gray-600">
                  Company <span className="text-[#0bbcaa]">*</span>
                </label>
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
                <label className="text-xs font-medium text-gray-600">
                  Location
                </label>
                <Input
                  name="location"
                  placeholder="e.g. London, UK / Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  Job URL
                </label>
                <Input
                  name="URL"
                  placeholder="https://..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  Salary Range
                </label>
                <Input
                  name="salaryRange"
                  placeholder="e.g. £60,000 – £80,000"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  Status
                </label>
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
              {/* Resume — dropdown: use default or upload new */}
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition-colors select-none ${
                        resume || defaultResume
                          ? "border-[#0bbcaa]/50 bg-[#0bbcaa]/5"
                          : "border-gray-200 hover:border-[#0bbcaa]/40 hover:bg-[#0bbcaa]/5"
                      }`}
                    >
                      <FileText
                        className={`w-6 h-6 ${resume || defaultResume ? "text-[#0bbcaa]" : "text-gray-400"}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                          {resume?.name || defaultResume?.filename}
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {!resume ? "Last used" : "PDF, DOC, DOCX"}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-52">
                    {resume ? (
                      <>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => {
                            setResume(null);
                          }}
                        >
                          <FileText className="w-4 h-4 text-[#0bbcaa]" />
                          {defaultResume?.filename}
                        </DropdownMenuItem>
                      </>
                    ) : null}

                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 text-gray-500" />
                      Upload new
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {resume && (
                  <button
                    type="button"
                    onClick={() => {
                      setResume(null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                <input
                  ref={resumeInputRef}
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Cover Letter — plain upload */}
              <label
                className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition-colors ${
                  coverLetter
                    ? "border-[#0bbcaa]/50 bg-[#0bbcaa]/5"
                    : "border-gray-200 hover:border-[#0bbcaa]/40 hover:bg-[#0bbcaa]/5"
                }`}
              >
                <FileText
                  className={`w-6 h-6 ${coverLetter ? "text-[#0bbcaa]" : "text-gray-400"}`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {coverLetter ? coverLetter.name : "Upload Cover Letter"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">PDF, DOC, DOCX</p>
                </div>
                {coverLetter && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCoverLetter(null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <input
                  name="coverLetter"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-main px-6 py-3 text-sm font-semibold text-white hover:bg-main-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Application →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
