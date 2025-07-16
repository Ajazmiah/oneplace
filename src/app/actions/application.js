"use server";
export async function createApplication(formData) {

  
    const jobTitle = formData.get("jobTitle");
    const company = formData.get("company");
  
    console.log("Submitted:", { jobTitle, company });
  
    // You could do database insert/update here
  
    // Optional: Redirect after submit
    // import { redirect } from "next/navigation";
    // redirect('/success');
  }