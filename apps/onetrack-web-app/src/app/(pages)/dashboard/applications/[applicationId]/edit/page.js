"use client";

import { useState } from "react";

import EditApplicationForm from "../../../../../../Components/Applications/EditApplicationForm";

function AddApplicationForm() {
  const [application] = useState(() => {
    const stored = localStorage?.getItem("application");
    return stored ? JSON.parse(stored) : null;
  });

  if (!application) return null;

  return <EditApplicationForm application={application} />;
}
export default AddApplicationForm;
