import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="bg-white rounded-lg border p-6 space-y-6 max-w-4xl mx-auto mt-10">
      <h2 className="text-xl font-semibold">Application Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          required
          placeholder="Job Title *"
          defaultValue="Senior Software Engineer"
        />
        <Input required placeholder="Company *" defaultValue="Tech Corp Inc." />
        <Input required placeholder="Position *" defaultValue="Full-time" />
        <Input placeholder="Location" defaultValue="San Francisco, CA" />
        <Input type="date" placeholder="Application Date" />
        <Select>
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
          className="md:col-span-2"
          placeholder="Salary Range"
          defaultValue="$80,000 - $120,000"
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Job Description / Notes</p>
        <Textarea placeholder="Add any notes about the role, requirements, or interview process..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 p-6 rounded-lg cursor-pointer text-center">
          <FileText className="w-6 h-6 mb-2 text-gray-500" />
          <span className="text-sm font-medium">Click to upload resume</span>
          <span className="text-xs text-gray-400">PDF, DOC, DOCX</span>
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
        </label>
        <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 p-6 rounded-lg cursor-pointer text-center">
          <FileText className="w-6 h-6 mb-2 text-gray-500" />
          <span className="text-sm font-medium">
            Click to upload cover letter
          </span>
          <span className="text-xs text-gray-400">PDF, DOC, DOCX</span>
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Save Application
        </Button>
      </div>
    </div>
  );
}
