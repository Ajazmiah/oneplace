import { Briefcase, MessageCircle, Award, XCircle } from "lucide-react";

const stats = [
  {
    key: "all",
    label: "applied",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    hoverBg: "hover:bg-blue-100",
  },
  {
    key: "interviewing",
    label: "Interviewing",
    icon: MessageCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    hoverBg: "hover:bg-amber-100",
  },
  {
    key: "offer",
    label: "Offers",
    icon: Award,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    hoverBg: "hover:bg-emerald-100",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
    hoverBg: "hover:bg-red-100",
  },
];

function StatusCard({
  applicationStatus,
  applications,
  filterByStatus,
  setFilterByStatus,
}) {
  const values = {
    all: applications.length,
    interviewing: applicationStatus.interviewing,
    offer: applicationStatus.offer,
    rejected: applicationStatus.rejected,
  };

  return (
    <>
      {stats.map(({ key, label, icon: Icon, color, bg, border, hoverBg }) => (
        // A real button so the filter works with Tab + Enter/Space;
        // aria-pressed tells screen readers which filter is on
        <button
          key={key}
          type="button"
          onClick={() => setFilterByStatus(key)}
          aria-pressed={filterByStatus === key}
          className={`bg-white rounded-xl border ${border} p-5 flex items-center gap-4 shadow-sm cursor-pointer text-left transition-colors ${hoverBg} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400`}
        >
          <span className={`${bg} ${color} rounded-lg p-2.5 flex-shrink-0`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-2xl font-bold text-slate-800 leading-none">{values[key]}</span>
            <span className="block text-xs text-slate-500 mt-1">{label}</span>
          </span>
        </button>
      ))}
    </>
  );
}

export default StatusCard;
