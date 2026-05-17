import { Briefcase, MessageCircle, Award, XCircle } from "lucide-react";

const stats = [
  {
    key: "total",
    label: "Total Applied",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    key: "interviewing",
    label: "Interviewing",
    icon: MessageCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    key: "offer",
    label: "Offers",
    icon: Award,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
  },
];

function StatusCard({ applicationStatus, applications }) {
  const values = {
    total: applications.length,
    interviewing: applicationStatus.interviewing,
    offer: applicationStatus.offer,
    rejected: applicationStatus.rejected,
  };

  return (
    <>
      {stats.map(({ key, label, icon: Icon, color, bg, border }) => (
        <div
          key={key}
          className={`bg-white rounded-xl border ${border} p-5 flex items-center gap-4 shadow-sm`}
        >
          <div className={`${bg} ${color} rounded-lg p-2.5 flex-shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 leading-none">{values[key]}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default StatusCard;
