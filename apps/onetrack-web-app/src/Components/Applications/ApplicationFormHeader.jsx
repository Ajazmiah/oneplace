import React from 'react'

function ApplicationFormHeader({header, jobTitle=""}) {
  return (
    <div className="mb-8">
    <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-[#0bbcaa]/25 bg-[#0bbcaa]/5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#0bbcaa] animate-pulse" />
      <span className="text-xs font-semibold tracking-widest uppercase text-[#0bbcaa]">
       {header}
      </span>
    </div>
    <h1 className="font-bold tracking-tight text-gray-900 text-3xl sm:text-4xl leading-[1.08]">
    {jobTitle !== ""? "Role": ""}
      <span
        style={{
          background: "linear-gradient(135deg, #0bbcaa 0%, #085041 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
       {" "+jobTitle}
      </span>
    </h1>
   
  </div>
  )
}

export default ApplicationFormHeader