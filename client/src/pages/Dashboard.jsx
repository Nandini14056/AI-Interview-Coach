import { useState, useEffect } from "react";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCard from "@/components/dashboard/StatCard";
import InterviewCard from "@/components/dashboard/InterviewCard";
import { MessageSquare, BarChart3, Code2, ArrowUpRight } from "lucide-react";
import { getRecentInterviews } from "@/services/interviewService";

const Dashboard = () => {
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await getRecentInterviews();
        setRecentInterviews(data);
      } catch (error) {
        setError("Failed to load recent interviews.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </header>

      <WelcomeBanner />

      {/* Stat Cards Grid*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* card-1 */}

        <StatCard title="Total Interviews" Icon={MessageSquare}>
          <div className="text-3xl font-bold text-gray-900 mb-2">34</div>
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4 this week</span>
          </div>
        </StatCard>

        {/* Card 2 */}
        <StatCard title="Average Score" Icon={BarChart3}>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            88{" "}
            <span className="text-base font-normal text-gray-400">/ 100</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-bl-full"
              style={{ width: "88%" }}
            ></div>
          </div>
        </StatCard>

        {/* Card 3 */}
        <StatCard title="Top Skill Evaluated" icon={Code2}>
          <div className="text-2xl font-bold text-gray-900 mb-3">Node.js</div>
          {/* Skill Tag Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-200">
              Architecture
            </span>
            <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-200">
              Async Flow
            </span>
          </div>
        </StatCard>
      </div>

      {/* Recent Interview Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Interviewa</h2>
          <a
            href="#"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All &rarr;
          </a>
        </div>

        {isLoading ? (
          <div className="text-gray-500 text-sm py-4">
            Loading your interviews...
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm py-4">{error}</div>
        ) : recentInterviews.length === 0 ? (
          <div className="text-gray-500 text-sm py-4">
            No recent interviews found. Time to start one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentInterviews.map((item) => (
              <InterviewCard
                key={item._id || item.id} // MongoDB uses _id
                type={item.type}
                date={item.date}
                title={item.title}
                tags={item.tags}
                score={item.score}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
