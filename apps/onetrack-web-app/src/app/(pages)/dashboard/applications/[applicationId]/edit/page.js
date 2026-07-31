"use client";

import { useState, useEffect } from "react";

import EditApplicationForm from "../../../../../../Components/Applications/EditApplicationForm";

function AddApplicationForm() {
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("application");
    setApplication(stored ? JSON.parse(stored) : null);
  }, []);

  if (!application) return null;

  return <EditApplicationForm application={application} />;
}
export default AddApplicationForm;
