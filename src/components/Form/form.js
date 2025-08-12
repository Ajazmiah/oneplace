import { Input } from "@/Components/ui/Input";
import { Button } from "@/Components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/Select";
import { Textarea } from "@/Components/ui/Textarea";
import { FileText } from "lucide-react";

export default function AddApplicationForm() {
  return (
    <div className="max-w-[760px] mx-auto">
      <h2 className="text-xl font-semibold border-b pb-5">Application Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          required
          placeholder="Job Title *"
          defaultValue="Senior Software Engineer"
        />
        <Input required placeholder="Company *"  />
        <Input placeholder="Location"/>
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
        //   defaultValue="$80,000 - $120,000"
        />
      </div>

      <div className="my-3">
    
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

      <div className="flex justify-end gap-2 my-3">
        <Button className="bg-main text-white hover:bg-blue-700">
          Save Application
        </Button>
      </div>
    </div>
  );
}
