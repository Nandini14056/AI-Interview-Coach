import { useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "@/services/interview.service";
import { getApiError } from "@/components/ui/Toast";
export default function History() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    getHistory()
      .then((r) => setItems(r.data || []))
      .catch((e) => setError(getApiError(e)));
  }, []);
  const shown = items.filter((x) =>
    `${x.role} ${x.mode} ${x.status}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PRACTICE LOG</span>
          <h1>Interview History</h1>
          <p>Review every practice session and jump back into your reports.</p>
        </div>
        <div className="input-wrap search">
          <Search size={15} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search interviews…"
          />
        </div>
      </div>
      {error && <div className="error-box">{error}</div>}
      <div className="history-table">
        <div className="table-row table-head">
          <span>Role</span>
          <span>Type</span>
          <span>Date</span>
          <span>Score</span>
          <span />
        </div>
        {shown.map((x) => (
          <button
            className="table-row"
            key={x._id}
            onClick={() =>
              nav(
                x.status === "Completed"
                  ? `/results/${x._id}`
                  : `/interview/${x._id}`,
              )
            }
          >
            <span>
              <strong>{x.role}</strong>
              <small>{x.difficulty}</small>
            </span>
            <span>{x.mode || "Text"}</span>
            <span>{new Date(x.createdAt).toLocaleDateString()}</span>
            <span className={x.overallScore >= 80 ? "score-good" : ""}>
              {x.status === "Completed"
                ? `${x.overallScore}/100`
                : "In progress"}
            </span>
            <span>
              <ArrowRight size={15} />
            </span>
          </button>
        ))}
        {!shown.length && (
          <div className="empty-card">No matching interviews.</div>
        )}
      </div>
    </div>
  );
}
