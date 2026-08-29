import CopyButton from "./CopyButton";

export type QuestionAndAnswer = {
  _id: string;
  question: string;
  answer: string;
};

const s: Record<string, React.CSSProperties> = {
  sectionTitle: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#888",
  },
  emptyText: { margin: 0, fontSize: 13, color: "#999" },
  qaWrap: { width: "100%", display: "flex", flexDirection: "column", gap: 8 },
  qaCard: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "10px 12px",
    border: "1px solid #eee",
    borderRadius: 8,
  },
  qaQuestion: { margin: 0, fontSize: 13, fontWeight: 600, color: "#111" },
  qaAnswerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  qaAnswer: { margin: 0, fontSize: 13, color: "#444", lineHeight: 1.4 },
};

export default function QuestionsAndAnswers({ items }: { items: QuestionAndAnswer[] }) {
  return (
    <div>
      <p style={s.sectionTitle}>Interview Q&amp;A</p>
      {items.length === 0 ? (
        <p style={s.emptyText}>No saved questions yet.</p>
      ) : (
        <div style={s.qaWrap}>
          {items.map((item) => (
            <div key={item._id} style={s.qaCard}>
              <p style={s.qaQuestion}>{item.question}</p>
              <div style={s.qaAnswerRow}>
                <p style={s.qaAnswer}>{item.answer}</p>
                <CopyButton text={item.answer} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
