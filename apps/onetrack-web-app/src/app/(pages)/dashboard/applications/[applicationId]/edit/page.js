"use client";

import { useEffect, useState } from "react";

import ApplicationForm from "../../../../../../Components/Applications/ApplicationForm";

function AddApplicationForm() {
  const [application, setApplication] = useState(() => {
    const stored = localStorage?.getItem("application");
    return stored ? JSON.parse(stored) : null;
  });

  return <ApplicationForm application={application} />;
}
export default AddApplicationForm;
