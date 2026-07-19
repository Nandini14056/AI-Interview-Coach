import { BrainCircuit, ChartSpline, MessageSquareText } from "lucide-react";

const HeroTrust = () => {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
        <BrainCircuit className="h-4 w-4 text-indigo-600" />

        AI Feedback
      </div>

      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
        <MessageSquareText className="h-4 w-4 text-indigo-600" />

        Mock Interviews
      </div>

      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
        <ChartSpline className="h-4 w-4 text-indigo-600" />

        Performance Analytics
      </div>
    </div>
  );
};

export default HeroTrust;