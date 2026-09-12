import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  Code2,
  Play,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "@/services/interview.service";
import { useAuth } from "@/context/AuthContext";
import { getApiError } from "@/components/ui/Toast";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getHistory()
      .then((r) => setItems(r.data || []))
      .catch((e) => setError(getApiError(e)));
  }, []);
  const avg = useMemo(
    () =>
      items.length
        ? Math.round(
            items.reduce((s, x) => s + (x.overallScore || 0), 0) / items.length,
          )
        : 0,
    [items],
  );
  const completed = items.filter((x) => x.status === "Completed");
  const top = completed
    .slice()
    .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))[0];
  return (
    <div className="dashboard">
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">YOUR INTERVIEW HUB</span>
          <h1>Welcome back, {user?.username || "Developer"}.</h1>
          <p>
            {items.length
              ? `You've completed ${items.length} practice session${items.length > 1 ? "s" : ""}. Keep the momentum going.`
              : "Your first practice interview is waiting. Start with a role and tech stack."}
          </p>
        </div>
        <button className="primary-btn" onClick={() => nav("/setup")}>
          <Play size={15} /> Start New Interview
        </button>
      </section>
      {error && <div className="error-box">{error}</div>}
      <div className="stats-grid">
        <Stat
          icon={CalendarDays}
          label="Total Interviews"
          value={items.length}
        />
        <Stat icon={TrendingUp} label="Average Score" value={`${avg}/100`} />
        <Stat
          icon={Award}
          label="Best Score"
          value={top ? `${top.overallScore}/100` : "—"}
        />
        <Stat icon={Code2} label="Top Role" value={top?.role || "—"} />
      </div>
      <div className="section-head">
        <h2>Recent Interviews</h2>
        <button className="link-btn" onClick={() => nav("/history")}>
          View All <ArrowRight size={14} />
        </button>
      </div>
      {items.length === 0 ? (
        <div className="empty-card">
          <BrainCircuit size={30} />
          <h3>No interviews yet</h3>
          <p>Start your first AI interview to see your performance here.</p>
          <button className="primary-btn" onClick={() => nav("/setup")}>
            Start practicing
          </button>
        </div>
      ) : (
        <div className="interview-grid">
          {items.slice(0, 3).map((x) => (
            <InterviewCard
              key={x._id}
              item={x}
              onClick={() =>
                x.status === "Completed"
                  ? nav(`/results/${x._id}`)
                  : nav(`/interview/${x._id}`)
              }
            />
          ))}
        </div>
      )}
      <div className="dashboard-lower">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Practice insight</h3>
              <p>Use your latest results to guide your next session.</p>
            </div>
            <BarChart3 size={19} />
          </div>
          <div className="insight-row">
            <div className="insight-score">
              {avg || 0}
              <span>/100</span>
            </div>
            <div>
              <strong>
                {avg >= 80 ? "Strong momentum" : "Room to improve"}
              </strong>
              <p>
                {avg >= 80
                  ? "Keep mixing technical and behavioral questions to stay interview-ready."
                  : "Complete a few sessions and review the weak topics in each report."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <Icon size={17} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function InterviewCard({ item, onClick }) {
  return (
    <button className="interview-card" onClick={onClick}>
      <div className="card-top">
        <span className="badge">{item.status}</span>
        <span>{fmtDate(item.createdAt)}</span>
      </div>
      <h3>{item.role}</h3>
      <p>
        {item.mode || "Text"} · {item.difficulty}
      </p>
      <div className="score-line">
        <span>Overall score</span>
        <strong>
          {item.status === "Completed"
            ? `${item.overallScore}/100`
            : "In progress"}
        </strong>
      </div>
    </button>
  );
}
