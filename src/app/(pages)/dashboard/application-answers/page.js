"use client";

const applicationAnswers = [
  {
    question: "Tell me about yourself.",
    answer:
      "I'm a full-stack developer with 3 years of experience building scalable web applications using React, Node.js, and PostgreSQL. I'm passionate about writing clean, maintainable code and have a strong track record of delivering features on time. Outside of work, I contribute to open-source projects and enjoy learning new technologies.",
  },
  {
    question: "Why do you want to work here?",
    answer:
      "I've followed your company's growth and product trajectory closely. The focus on developer tooling and your commitment to an open engineering culture really resonate with me. I believe my experience in building performant UIs aligns well with the challenges your team is solving, and I'm excited by the opportunity to contribute meaningfully from day one.",
  },
  {
    question: "Describe a challenging project you worked on.",
    answer:
      "At my previous role I led the migration of a monolithic Express API to a microservices architecture. The main challenge was maintaining zero downtime for 50k+ daily active users. I introduced a strangler-fig pattern, moving one domain at a time behind a feature flag, and coordinated with QA to automate regression tests for each slice. The project completed two weeks ahead of schedule with no production incidents.",
  },
  {
    question: "What is your greatest weakness?",
    answer:
      "I used to struggle with delegating tasks — I preferred to handle things myself to ensure quality. Over time I've learned that trusting teammates and providing clear context leads to better outcomes for everyone. I now proactively share context, write thorough documentation, and schedule regular check-ins so I can delegate confidently.",
  },
  {
    question: "Where do you see yourself in five years?",
    answer:
      "I see myself in a senior or staff engineering role, driving technical direction for a meaningful product. I want to deepen my expertise in distributed systems while also growing as a mentor for junior engineers. Ultimately I'm looking for a place where I can build long-term, and this role feels like a strong foundation for that path.",
  },
];

export default function ApplicationAnswersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Application Answers
        </h1>
        <p className="text-gray-500 mt-1">
          Polished responses to common interview and application questions
        </p>
      </div>

      <div className="grid gap-5">
        {applicationAnswers.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                {index + 1}
              </span>
              <h2 className="text-base font-semibold text-gray-800 leading-snug">
                {item.question}
              </h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed pl-10">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
