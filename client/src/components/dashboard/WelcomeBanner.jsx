import { Play } from "lucide-react";

const WelcomeBanner = () => {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Left Side: Greeting and Stats */}
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Alex.
        </h2>
        <p className="text-gray-600 leading-relaxed">
          You've completed 12 practice sessions this month. Your average
          response clarity has improved by 15%. Ready for the next challenge?
        </p>
      </div>

      {/* Right Side: Action Button */}
      <button className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
        <Play className="w-4 h-4 fill-current" />
        Start New Interview
      </button>
    </div>
  );
};

export default WelcomeBanner;
