import { ArrowUpRight } from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  className = "",
}) => {
  return (
    <div
      className={`absolute flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-xl ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
        <Icon size={18} className="text-indigo-600" />
      </div>

      <span className="font-medium text-slate-800">
        {title}
      </span>

      <ArrowUpRight
        size={16}
        className="text-indigo-500"
      />
    </div>
  );
};

export default FeatureCard;