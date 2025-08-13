"use client";

import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { createApplication } from "@/app/lib/actions/addApplication/addApplicationAction";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { FileText } from "lucide-react";

export default function AddApplicationForm() {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");

  const [salaryRange, setSalaryRange] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("applied");

  const fileInputs = [
    {
      key: "resume",
      label: "Click to upload resume",
      file: resume,
      onChange: handleFileUpload,
    },
    {
      key: "coverLetter",
      label: "Click to upload cover letter",
      file: coverLetter,
      onChange: handleFileUpload, // or a different handler if needed
    },
  ];

  function handleFileUpload(e) {
    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];
    const file = e.target.files[0]; // ✅ Get the first file

    if (!file) {
      console.log("No file selected");
      return;
    }

    const { type, size, name } = file;

    // ✅ Optional: check MIME type for PDF or Word

    const inputName = e.target.name;

    if (!allowedTypes.includes(type)) {
      console.log("Invalid file type:", type);
      return;
    }

    if (inputName === "resume") setResume({ type, size, name });
    else setCoverLetter({ type, name, size });

    // ✅ Success
    console.log("File is valid:", { name, type, size });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (!jobTitle || !companyName) {
        throw new Error({ message: "Job title and company are required." });
      }
      const formData = new FormData();

      // formData.append("resume", resume);
      // formData.append("coverLetter", coverLetter);

      formData.append("jobTitle", jobTitle);
      formData.append("status", status);
      formData.append("companyName", companyName);
      formData.append("location", location);
      formData.append("salaryRange", salaryRange);
      formData.append("details", details);
      await createApplication(formData);
    } catch (e) {
      alert(e.message);
    }
  }
  return (
    <div className="max-w-[760px] mx-auto">
      <h2 className="text-xl font-semibold border-b pb-5">
        Application Details
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            required
            name="jobTitle"
            placeholder="Job Title *"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Input
            required
            name="company"
            placeholder="Company *"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Input
            name="location"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Select name="status" onValueChange={(value) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Input
            name="salaryRange"
            className="md:col-span-2"
            placeholder="Salary Range"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
          />
        </div>

        <div className="my-3">
          <Textarea
            name="notes"
            placeholder="Add any notes about the role, requirements, or interview process..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fileInputs.map(({ key, label, file, onChange }) => (
            <label
              key={key}
              className="flex flex-col items-center justify-center border border-dashed border-gray-300 p-6 rounded-lg cursor-pointer text-center"
            >
              <FileText className="w-6 h-6 mb-2 text-gray-500" />
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs text-gray-400">
                {file ? file.name : "PDF, DOC, DOCX"}
                {file ? (
                  <span
                    onClick={() => {
                      key === "resume" ? setResume(null) : setCoverLetter(null);
                    }}
                  >
                    x
                  </span>
                ) : null}
              </span>
              <input
                name={key}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={onChange}
              />
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 my-3">
          <Button
            className="bg-main text-white hover:bg-blue-700"
            type="submit"
          >
            Save Application
          </Button>
        </div>
      </form>
    </div>
  );
}
