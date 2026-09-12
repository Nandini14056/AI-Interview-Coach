import { useEffect, useState } from "react";
import { BarChart3, Target, TrendingUp } from "lucide-react";
import { getHistory } from "@/services/interview.service";
export default function Analytics() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    getHistory().then((r) => setItems(r.data || []));
  }, []);
  const done = items.filter((x) => x.status === "Completed");
  const avg = done.length
    ? Math.round(done.reduce((s, x) => s + x.overallScore, 0) / done.length)
    : 0;
  const best = done.length ? Math.max(...done.map((x) => x.overallScore)) : 0;
  const max = best || 100;
  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">PERFORMANCE ANALYTICS</span>
          <h1>Track your growth</h1>
          <p>
            Use your scores to see whether your interview readiness is
            improving.
          </p>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <TrendingUp size={17} />
          <span>Average score</span>
          <strong>{avg}/100</strong>
        </div>
        <div className="stat-card">
          <Target size={17} />
          <span>Best score</span>
          <strong>{best}/100</strong>
        </div>
        <div className="stat-card">
          <BarChart3 size={17} />
          <span>Completed sessions</span>
          <strong>{done.length}</strong>
        </div>
      </div>
      <div className="panel analytics-panel">
        <div className="panel-head">
          <div>
            <h2>Score progression</h2>
            <p>Latest completed sessions</p>
          </div>
        </div>
        {done.length ? (
          <div className="bars">
            {done
              .slice()
              .reverse()
              .slice(-10)
              .map((x) => (
                <div className="bar-item" key={x._id}>
                  <div className="bar">
                    <span
                      style={{
                        height: `${Math.max(8, (x.overallScore / max) * 100)}%`,
                      }}
                    />
                  </div>
                  <small>{x.overallScore}</small>
                  <label>
                    {new Date(x.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </label>
                </div>
              ))}
          </div>
        ) : (
          <div className="empty-card">
            Complete an interview to unlock your score chart.
          </div>
        )}
      </div>
    </div>
  );
}
