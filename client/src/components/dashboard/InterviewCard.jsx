import { MoveRight } from "lucide-react";

const InterviewCard = ({ type, date, title, tags, score }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-400 p-5 shadow-sm flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
            {type}
          </span>
          <span>{date}</span>
        </div>

        <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
          {title}
        </h3>

        <p className="text-xs text-gray-500 font-medium">{tags}</p>
      </div>

      {/*Bottom Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
            OVERALL SCORE
          </span>
          <span className="text-sm font-bold text-emerald-600">
            {score}{" "}
            <span className="text-xs font-normal text-gray-400">/100</span>
          </span>
        </div>

        <MoveRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default InterviewCard;
