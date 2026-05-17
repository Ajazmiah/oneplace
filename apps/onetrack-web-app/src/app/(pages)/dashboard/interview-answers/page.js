import { getQuestionsAndAnswers } from "@/app/lib/DataAccessLayer/getQuestionsAndAnswers";

export default async function ApplicationAnswersPage() {
  const questions = await getQuestionsAndAnswers();

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

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-gray-500 text-sm">No answers saved yet.</p>
          <a
            href="/dashboard/add-interview-answer"
            className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
          >
            Add your first question &rarr;
          </a>
        </div>
      ) : (
        <div className="grid gap-5">
          {questions.map((item, index) => (
            <div
              key={item._id}
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
      )}
    </div>
  );
}
