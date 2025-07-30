"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createApplication } from "@/app/actions/application";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

export default function AddApplicationForm() {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // ✅ Get the first file

    if (!file) {
      console.log("No file selected");
      return;
    }

    const { type, size, name } = file;

    // ✅ Optional: check MIME type for PDF or Word
    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];
     
    const inputName = e.target.name

    if (!allowedTypes.includes(type)) {
      console.log("Invalid file type:", type);
      return;
    }

    if (inputName === "resume") setResume({ type, size, name });
    else setCoverLetter(type, name, size);

    // ✅ Success
    console.log("File is valid:", { name, type, size });
  };

  return (
    <div className="max-w-[760px] mx-auto">
      <h2 className="text-xl font-semibold border-b pb-5">
        Application Details
      </h2>

      <form action={createApplication}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            required
            name="jobTitle"
            placeholder="Job Title *"
            defaultValue="Senior Software Engineer"
          />
          <Input required name="company" placeholder="Company *" />
          <Input name="location" placeholder="Location" />

          <Select name="status">
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
          />
        </div>

        <div className="my-3">
          <Textarea
            name="notes"
            placeholder="Add any notes about the role, requirements, or interview process..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 p-6 rounded-lg cursor-pointer text-center">
            <FileText className="w-6 h-6 mb-2 text-gray-500" />
            <span className="text-sm font-medium">Click to upload resume</span>
            <span className="text-xs text-gray-400">{resume ? resume.name : 'PDF, DOC, DOCX'}</span>
            <input
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileUpload(e)}
            />
          </label>

          <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 p-6 rounded-lg cursor-pointer text-center">
            <FileText className="w-6 h-6 mb-2 text-gray-500" />
            <span className="text-sm font-medium">
              Click to upload cover letter
            </span>
            <span className="text-xs text-gray-400">PDF, DOC, DOCX</span>
            <input
              name="coverLetter"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 my-3">
          <Button className="bg-main text-white hover:bg-blue-700">
            Save Application
          </Button>
        </div>
      </form>
    </div>
  );
}
