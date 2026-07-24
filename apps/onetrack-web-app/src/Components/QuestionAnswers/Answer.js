export default function Answer({ questions }) {
  return (
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
  );
}
