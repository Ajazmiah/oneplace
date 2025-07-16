import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, PlusCircle, FileText } from "lucide-react";

export default function Sidebar({ clickHandler }) {


  return (
    <>
      <aside className="w-64 bg-white border-r p-6 space-y-6">
        <div className="text-xl font-semibold">JobTracker</div>
        <nav className="space-y-3">
          <Button variant="secondary" className="w-full justify-start" onClick={() => clickHandler('applications')}>
            <FileText className="h-5 w-4" />
            My Applications
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => clickHandler('add_application')}>
            <PlusCircle className="h-5 w-4"/>
            Add Application
          </Button>
        </nav>
      </aside>
    </>
  );
}
