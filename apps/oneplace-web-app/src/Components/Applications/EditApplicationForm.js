"use client";

import { Input } from "@/Components/ui/input";
import { useState, useEffect } from "react";
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
import { editApplication } from "@/app/lib/actions/applications/applicationActions";
import AlertDialogBox from "../AlertDialog/AlertDialog";
import ApplicationFormHeader from "./ApplicationFormHeader";
import ResumeSelect, { appendResumeChoice } from "@/Components/Resumes/ResumeSelect";
import { appendUpload } from "@/app/lib/utils/uploadToS3";

function EditApplicationForm({ application }) {
  // The application's current resume: a library resume (populated to { _id, filename }),
  // or its own copy if it was made before the library
  const currentLibrary = application.resumeId;
  const currentId =
    typeof currentLibrary === "object" ? currentLibrary?._id : currentLibrary;
  const currentFilename = currentLibrary?.filename ?? application.resume?.filename;
  const hasResume = Boolean(currentId || application.resume?.key);

  const [resumes, setResumes] = useState([]);
  // "keep" sends nothing, so saving without touching the field leaves the resume as it is
  const [resumeChoice, setResumeChoice] = useState(hasResume ? { type: "keep" } : null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/resumes")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.success) setResumes(data.resumes);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // If the current resume is one of the saved ones, show it selected in the list instead of
  // as a separate "Current resume" entry
  const currentInLibrary = Boolean(currentId) && resumes.some((r) => r._id === currentId);
  const keep =
    hasResume && !currentInLibrary
      ? {
          filename: currentFilename || "Current resume",
          viewUrl: `/api/application/${application._id}/resume`,
        }
      : null;
  const shownChoice =
    resumeChoice?.type === "keep" && currentInLibrary
      ? { type: "library", id: currentId }
      : resumeChoice;

  const [jobTitle, setJobTitle] = useState(application.jobTitle || "");
  const [companyName, setCompanyName] = useState(application.companyName || "");
  const [location, setLocation] = useState(application.location || "");
  const [salaryRange, setSalaryRange] = useState(application.salaryRange || "");
  const [details, setDetails] = useState(application.description || "");
  const [status, setStatus] = useState(application.status || "applied");
  const [jobUrl, setJobUrl] = useState(application.jobUrl || "");
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

    setCoverLetter(file);
  }

  // New files go straight to S3 first; the server action then receives only their keys
  const getFormData = async () => {
    const formData = new FormData();
    await appendResumeChoice(formData, resumeChoice);
    await appendUpload(formData, "coverLetter", coverLetter);
    formData.append("jobTitle", jobTitle);
    formData.append("status", status);
    formData.append("companyName", companyName);
    formData.append("location", location);
    formData.append("salaryRange", salaryRange);
    formData.append("details", details);
    formData.append("jobUrl", jobUrl);
    return formData;
  };

  const handleConfirmed = async () => {
    setOpen(false);
    setIsSubmitting(true);
    try {
      const formData = await getFormData();
      const response = await editApplication(application._id, formData);
      if (!response?.success) {
        setError(response?.message || "Something went wrong");
        return;
      }
      toast(response.message);
      router.back();
    } catch (err) {
      // fetch() throws TypeError when offline; upload errors carry a readable message
      setError(
        err instanceof TypeError ? "Network error — please try again" : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!jobTitle || !companyName) {
      setError("Job title and company are required");
      return;
    }
    setOpen(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <AlertDialogBox
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirmed}
        title="Are you sure you want to edit?"
      />

      {/* Page header */}
      <ApplicationFormHeader header={'Edit application'} jobTitle={jobTitle}/>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section: Role details */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Role details
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">
                  Job Title <span className="text-brand-strong">*</span>
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
                  Company <span className="text-brand-strong">*</span>
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
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
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
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Documents
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Resume — current, saved resumes or upload new, with View */}
              <ResumeSelect
                resumes={resumes}
                value={shownChoice}
                onChange={setResumeChoice}
                keep={keep}
              />

              {/* Cover Letter — plain upload */}
              <label
                className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#0bbcaa]/40 ${
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
                  <p className="text-xs text-gray-500 mt-0.5">PDF, DOC, DOCX</p>
                </div>
                {coverLetter && (
                  <button
                    type="button"
                    aria-label="Remove cover letter"
                    onClick={(e) => { e.preventDefault(); setCoverLetter(null); }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                )}
                <input
                  name="coverLetter"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  // sr-only, not hidden: display:none would drop it from the tab order
                  className="sr-only"
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
              className="rounded-lg bg-brand-strong px-6 py-3 text-sm font-semibold text-white hover:bg-brand-strong-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditApplicationForm;
