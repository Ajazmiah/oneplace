// Create panel
const panel = document.createElement("div");
panel.className = "joblogPopUp";
panel.innerHTML = `
  <div class="form-container">
    <h2>Job Logs</h2>
    <form id="jobApplicationForm">
      <div class="form-group">
        <label for="companyName">Company Name</label>
        <input type="text" id="companyName" placeholder="Enter name of the company" />
      </div>

      <div class="form-group">
        <label for="jobTitle">Job Title</label>
        <input type="text" id="jobTitle" placeholder="Enter the job title" />
      </div>

      <div class="form-group">
        <label for="resume">Upload Resume</label>
        <input type="file" id="resume" accept=".pdf,.doc,.docx" />
      </div>

      <div class="form-group">
        <label for="coverLetter">Upload Cover Letter</label>
        <input type="file" id="coverLetter" accept=".pdf,.doc,.docx" />
      </div>

      <div class="form-group">
        <label for="jobDescription">Job Description</label>
        <textarea id="jobDescription" rows="5" placeholder="Describe the job..."></textarea>
      </div>

      <button type="submit">Submit Application</button>
      <button type="button" id="close">Close</button>
    </form>
  </div>
`;

document.body.appendChild(panel);

// Panel controls
function loadPanel() {
  panel.style.right = "0";
}

function closePanel() {
  panel.style.right = "-100%";
}

function togglePanel() {
  panel.style.right = panel.style.right === "0" ? "-100%" : "0";
}

// Form handler
async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("companyName", companyName.value);
  formData.append("jobTitle", jobTitle.value);
  formData.append("resume", resume.files[0]);
  formData.append("coverLetter", coverLetter.files[0]);
  formData.append("jobDescription", jobDescription.value);

  // Example: Convert to object for logging
  const data = Object.fromEntries(formData.entries());
  console.log(data);

  // Example POST request (uncomment and adjust URL if needed)
  /*
  const response = await fetch("http://localhost:3000/joblogroute", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  console.log("Response:", result);
  alert("Application submitted!");
  */
}

// Init
window.onload = function () {
  setTimeout(() => {
    loadPanel();
    document.getElementById("jobApplicationForm").addEventListener("submit", handleSubmit);
    document.getElementById("close").addEventListener("click", closePanel);
  }, 500);
};

module.exports = { togglePanel };
