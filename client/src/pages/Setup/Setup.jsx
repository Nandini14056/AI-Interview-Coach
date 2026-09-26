import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Sparkles, X } from "lucide-react";
import { startInterview } from "@/services/interview.service";
import { getApiError } from "@/components/ui/Toast";

const techDefaults = ["Node.js", "Express", "MongoDB"];
export default function Setup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "",
    difficulty: "Medium",
    interviewType: "Role",
    mode: "Text",
    numberOfQuestions: 10,
    resumeText: "",
    techStack: techDefaults,
  });
  const [tech, setTech] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const addTech = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tech.trim()) {
      e.preventDefault();
      if (!form.techStack.includes(tech.trim()))
        setForm({ ...form, techStack: [...form.techStack, tech.trim()] });
      setTech("");
    }
  };
  const removeTech = (item) =>
    setForm({ ...form, techStack: form.techStack.filter((x) => x !== item) });
  const submit = async (e) => {
    e.preventDefault();
    if (!form.role.trim()) return setError("Target role is required.");
    setError("");
    setBusy(true);
    try {
      const res = await startInterview({
        ...form,
        role: form.role.trim(),
        numberOfQuestions: Number(form.numberOfQuestions),
        resumeUrl: "",
      });
      navigate(`/interview/${res.data.interviewId}`);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-progress">
        <span className="active">
          1<span>Setup</span>
        </span>
        <i />
        <span>
          2<span>Interview</span>
        </span>
        <i />
        <span>
          3<span>Results</span>
        </span>
      </div>
      <form className="setup-card" onSubmit={submit}>
        <div className="section-title">
          <div>
            <h1>Configure Session</h1>
            <p>
              Define the parameters for your AI-guided interview to ensure a
              targeted assessment.
            </p>
          </div>
          <Sparkles size={22} />
        </div>
        <label>
          Target Role
          <div className="input-wrap">
            <BriefcaseBusiness size={15} />
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g., Senior Backend Engineer"
            />
          </div>
        </label>
        <label>
          Primary Tech Stack
          <div className="tag-input">
            {form.techStack.map((t) => (
              <span key={t} className="tag">
                {t}
                <button type="button" onClick={() => removeTech(t)}>
                  <X size={11} />
                </button>
              </span>
            ))}
            <input
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              onKeyDown={addTech}
              placeholder="Type and press enter…"
            />
          </div>
        </label>
        <label>
          Number of Questions
          <div className="range-row">
            <input
              type="range"
              min="1"
              max="20"
              value={form.numberOfQuestions}
              onChange={(e) =>
                setForm({ ...form, numberOfQuestions: e.target.value })
              }
            />
            <strong>{form.numberOfQuestions}</strong>
          </div>
        </label>
        <label>
          Difficulty Level
          <div className="option-grid">
            {["Easy", "Medium", "Hard"].map((x) => (
              <button
                type="button"
                key={x}
                className={`option ${form.difficulty === x ? "selected" : ""}`}
                onClick={() => setForm({ ...form, difficulty: x })}
              >
                {x}
              </button>
            ))}
          </div>
        </label>
        <label>
          Interview Focus
          <div className="option-grid three">
            {[
              [
                "Technical",
                "Focus strictly on standard questions for this position.",
              ],
              [
                "HR",
                "Deep dive into your past experience and projects.",
              ],
              [
                "Mixed",
                "A balanced combination of technical and behavioral.",
              ],
            ].map(([v, d]) => (
              <button
                type="button"
                key={v}
                className={`focus-option ${form.interviewType === v ? "selected" : ""}`}
                onClick={() => setForm({ ...form, interviewType: v })}
              >
                <b>{v}</b>
                <small>{d}</small>
              </button>
            ))}
          </div>
        </label>
        <label>
          Interview Mode
        {/* <div className="mode-row">
            {["Text", "Voice", "Video"].map((x) => (
              <button
                type="button"
                key={x}
                className={`mode-pill ${form.mode === x ? "selected" : ""}`}
                onClick={() => setForm({ ...form, mode: x })}
              >
                {x}
              </button>
            ))}
          </div> */}
          <div className="mode-row">
            <button
                type="button"
                className={`mode-pill ${form.mode === "Text" ? "selected" : ""}`}
                onClick={() => setForm({ ...form, mode:"Text" })}
              >
                Text
              </button>
          </div>
        </label>
        {error && <div className="error-box">{error}</div>}
        <button className="primary-btn wide large" disabled={busy}>
          <Sparkles size={17} />
          {busy ? "Generating questions…" : "Generate AI Questions"}
        </button>
        <p className="fine-print">
          This may take a few seconds while the AI model tailors your session.
        </p>
      </form>
    </div>
  );
}
