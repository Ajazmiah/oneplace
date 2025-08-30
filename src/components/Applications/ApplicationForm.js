"use client";

import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { createApplication } from "@/app/lib/actions/addApplication/addApplicationAction";
import { useEffect, useState } from "react";
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
import { FileText } from "lucide-react";
import { editApplication } from "@/app/lib/DataAccessLayer/applications";
import { redirect } from "next/navigation";
import AlertDialogBox from "../AlertDialog/AlertDialog";

function ApplicationForm({ application = null }, props) {
  const [resume, setResume] = useState(null);
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

  const [jobUrl, setJobUrl] = useState(application?.jobUrl || '')

  const router = useRouter();

  useEffect(() => {
    console.log("USEEFFECT", application);
  }, [application]);

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

  const getFormData = () => {
    const formData = new FormData();

    // formData.append("resume", resume);
    // formData.append("coverLetter", coverLetter);

    formData.append("jobTitle", jobTitle);
    formData.append("status", status);
    formData.append("companyName", companyName);
    formData.append("location", location);
    formData.append("salaryRange", salaryRange);
    formData.append("details", details);

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
      response = await createApplication(formData);
    } else {
      setOpen(true);
    }

    if (!response?.success) {
      console.error("Error:", response.message);
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

    localStorage.removeItem("application");
    application ? toast("Successfully edited") : toast("application added");

    router.push("/dashboard/applications");
  }

  const Inputs = [
    {
      name: "jobTitle",
      placeholder: "Job Title *",
      value: jobTitle,
      required: true,
      onChange: (e) => setJobTitle(e.target.value),
    },
    {
      name: "URL",
      placeholder: "Job URL",
      value: jobUrl,
      required: false,
      onChange: (e) => setJobUrl(e.target.value),
      
    },
    {
      name: "company",
      placeholder: "Company *",
      value: companyName,
      required: true,
      onChange: (e) => setCompanyName(e.target.value),
    },
    {
      name: "location",
      placeholder: "Location",
      value: location,
      required: false,
      onChange: (e) => setLocation(e.target.value),
    },
  ];

  return (
    <div className="max-w-[760px] mx-auto">
      <AlertDialogBox
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirmed}
        title="Are you sure you want to edit?"
      />
      <h2 className="text-xl font-semibold border-b pb-5">
        Application Details
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Inputs.map((input, index) => (
            <Input
              key={index}
              {...input} // spreads name, placeholder, value, required, onChange
            />
          ))}

          <Select
            name="status"
            onValueChange={(value) => setStatus(value)}
            defaultValue={status}
          >
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

export default ApplicationForm;
