import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getResult } from "@/services/interview.service";
import { getApiError } from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";

export default function Results() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(0);
  useEffect(() => {
    getResult(id)
      .then((r) => setData(r.data))
      .catch((e) => setError(getApiError(e)));
  }, [id]);
  const questions = data?.questions || [];
  const strengths = useMemo(
    () => questions.filter((q) => q.score >= 8).slice(0, 3),
    [questions],
  );
  if (error)
    return (
      <div className="center-page">
        <div className="error-box">{error}</div>
        <button className="outline-btn" onClick={() => nav("/dashboard")}>
          Back to dashboard
        </button>
      </div>
    );
  if (!data)
    return (
      <div className="center-page">
        <Spinner />
      </div>
    );
  const score = Math.round(data.interview.overallScore || 0);
  return (
    <div className="results-page">
      <div className="results-head">
        <div>
          <button className="back-btn" onClick={() => nav("/dashboard")}>
            <ArrowLeft size={14} /> Dashboard
          </button>
          <span className="eyebrow">INTERVIEW PERFORMANCE REPORT</span>
          <h1>{data.interview.role}</h1>
          <p>
            Completed{" "}
            {new Date(
              data.interview.completedAt || data.interview.updatedAt,
            ).toLocaleDateString()}{" "}
            · {data.interview.techStack?.join(", ")}
          </p>
        </div>
        <button className="outline-btn" onClick={() => window.print()}>
          <Download size={14} /> Export / Print
        </button>
      </div>
      <div className="results-overview">
        <div className="score-card">
          <span>Overall Score</span>
          <div
            className="score-ring"
            style={{ "--score": `${score * 3.6}deg` }}
          >
            <strong>{score}%</strong>
          </div>
          <small>
            {score >= 80 ? "Strong performance" : "Keep practicing"}
          </small>
        </div>
        <div className="summary-card">
          <div className="panel-head">
            <div>
              <h2>AI Evaluation Summary</h2>
              <p>{data.interview.overallFeedback}</p>
            </div>
            <Sparkles size={18} />
          </div>
          <div className="metric-row">
            <div>
              <TrendingUp size={15} />
              <span>Questions answered</span>
              <strong>{questions.length}</strong>
            </div>
            <div>
              <Target size={15} />
              <span>Weak topics</span>
              <strong>{data.interview.weakTopics?.length || 0}</strong>
            </div>
            <div>
              <CheckCircle2 size={15} />
              <span>Strong answers</span>
              <strong>{strengths.length}</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="results-two">
        <div className="panel">
          <h3>Key Strengths</h3>
          {strengths.length ? (
            <ul>
              {strengths.map((q) => (
                <li key={q._id}>
                  <CheckCircle2 size={14} />
                  {q.question}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">
              Your report will highlight strong answers after more practice.
            </p>
          )}
        </div>
        <div className="panel weak-panel">
          <h3>Weak Topics</h3>
          {data.interview.weakTopics?.length ? (
            <div className="tag-list">
              {data.interview.weakTopics.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          ) : (
            <p className="muted">No recurring weak topics were identified.</p>
          )}
        </div>
      </div>
      <div className="panel breakdown">
        <div className="section-head">
          <h2>Question Breakdown</h2>
          <span>{questions.length} questions</span>
        </div>
        {questions.map((q, i) => (
          <div className="breakdown-item" key={q._id}>
            <button onClick={() => setOpen(open === i ? -1 : i)}>
              <span>
                <small>QUESTION {i + 1}</small>
                {q.question}
              </span>
              <b
                className={q.score >= 8 ? "good" : q.score >= 6 ? "mid" : "low"}
              >
                {q.score}/10{" "}
                {open === i ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </b>
            </button>
            {open === i && (
              <div className="breakdown-body">
                <div>
                  <h4>Candidate answer</h4>
                  <p>{q.userAnswer || "No answer provided."}</p>
                </div>
                <div>
                  <h4>AI feedback</h4>
                  <p>{q.feedback || "No feedback available."}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="next-step">
        <Lightbulb size={19} />
        <div>
          <strong>Next best step</strong>
          <p>
            Review your weak topics, then run another interview at the same
            difficulty until your score stabilizes.
          </p>
        </div>
        <button className="primary-btn" onClick={() => nav("/setup")}>
          Practice again
        </button>
      </div>
    </div>
  );
}
