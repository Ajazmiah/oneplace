export default function Answer({ questions }) {
  return (
    <div className="grid gap-5">
      {questions.map((item, index) => (
        <div
          key={item._id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start gap-3">
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
