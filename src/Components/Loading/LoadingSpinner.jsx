import React from "react";
import { Spinner } from "@/Components/ui/spinner";

export default function LoadingSpinner({text = "Loading..."}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className='size-8'/>
      <p className="text-sm block">{text}</p>
    </div>
  );
}
