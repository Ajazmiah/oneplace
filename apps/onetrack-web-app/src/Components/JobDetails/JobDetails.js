"use client";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  Edit,
  Building,
  LinkIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "../ui/badge";
import withApplicationContext from "../ContextWrapper/ContextWrapper";
import { useRouter } from "next/navigation";
import { deleteApplication } from "@/app/lib/actions/applications/applicationActions";
import { openDocument } from "@/app/lib/utils/utils";
import { toast } from "sonner";
import AlertDialogBox from "../AlertDialog/AlertDialog";
import { useState } from "react";

const statusColors = {
  applied: "bg-blue-100 text-blue-800 border-blue-200",
  interviewing: "bg-amber-100 text-amber-800 border-amber-200",
  offer: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  withdrawn: "bg-gray-100 text-gray-800 border-gray-200",
};

function JobDetails({ job }) {
  console.log("JOBBB INSIDE DETAILS ", job);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const handleEdit = (id) => {
    localStorage.setItem("application", JSON.stringify(job));
    router.push(`/dashboard/applications/${id}/edit`);
  };

  const handleConfirmed = async () => {
    const res = await deleteApplication(job._id);
    toast(res.message);
    setOpen(false);
    router.push("/dashboard/applications");
  };

  const handleDelete = () => {
    setOpen(true);
  };

  const showDescriptionClasses = !showDescription ? 'hidden' : ''

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Alert Dialog */}
      <AlertDialogBox
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirmed}
        title="Are you sure you want to delete it"
        description="This action cannot be undone. This will permanently delete your
            application"
      />

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            className="border-slate-200 mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-lg md:text-2xl font-bold text-slate-900">
                      {job.jobTitle}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-600 mt-2">
                      <Building className="w-4 h-4" />
                      <span>{job.companyName}</span>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      statusColors[job.status]
                    } border text-sm px-4 py-1.5`}
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Job Description & Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <button
                  onClick={() => setShowDescription((prev) => !prev)}
                  aria-expanded={showDescription}
                  className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#0bbcaa]/30 bg-[#0bbcaa]/10 px-3 py-1.5 text-xs font-semibold text-[#0a998b] transition-colors hover:bg-[#0bbcaa]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0bbcaa]/40"
                >
                  {showDescription ? "Hide Description" : "Show Description"}
                  {showDescription ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
                {job.description ? (
                  <div className={`${showDescriptionClasses} prose prose-slate max-w-none text-slate-700`}>
                    <p>
                      {job.description.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500">
                    No description or notes provided.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-slate-500" />
                  <span className="font-medium text-slate-800">
                    {job.location || "N/A"}
                  </span>
                </div>
                {job.applicationDate && (
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-3 text-slate-500" />
                    <span className="font-medium text-slate-800">
                      Applied on {job.applicationDate}
                    </span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-3 text-slate-500" />
                  <span className="font-medium text-slate-800">
                    {job.salaryRange || "N/A"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <LinkIcon className="w-4 h-4 mr-3 text-slate-500" />
                  <span className="font-medium text-slate-800">
                    {job.jobUrl ? (
                      <a href={job.jobUrl}> Go To Job Post</a>
                    ) : (
                      "N/A"
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.resume ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-200"
                    onClick={() =>
                      openDocument(`/api/application/${job._id}/resume`)
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Resume
                  </Button>
                ) : (
                  <p className="text-sm text-slate-500">No resume uploaded.</p>
                )}
                {job.coverLetter ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-200"
                    onClick={() =>
                      openDocument(`/api/application/${job._id}/coverletter`)
                    }
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    View Cover Letter
                  </Button>
                ) : (
                  <p className="text-sm text-slate-500">
                    No cover letter uploaded.
                  </p>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={() => handleEdit(job._id)}
              className="w-full text-white"
              style={{ backgroundColor: "#0bbcaa" }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Application
            </Button>

            <Button onClick={handleDelete} className="w-full text-white">
              <Edit className="w-4 h-4 mr-2" />
              Delete Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withApplicationContext(JobDetails);
