import { Sparkles } from "lucide-react";

const HeroBadge = () => {
  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
      <Sparkles className="h-4 w-4" />

      AI-Powered Interview Preparation
    </div>
  );
};

export default HeroBadge;