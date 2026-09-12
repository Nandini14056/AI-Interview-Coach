import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Mic2,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand">
          <div className="brand-mark">
            <BrainCircuit size={18} />
          </div>
          <div>
            <strong>AI Interview</strong>
            <span>Coach</span>
          </div>
        </div>
        <div>
          <button
            className="text-btn"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
          >
            {isAuthenticated ? "Dashboard" : "Sign in"}
          </button>
          <button className="primary-btn" onClick={() => navigate("/setup")}>
            Start Interview <ArrowRight size={15} />
          </button>
        </div>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge">
            <Sparkles size={14} /> Personalized AI practice
          </div>
          <h1>
            Practice smarter.
            <br />
            <span>Interview stronger.</span>
          </h1>
          <p>
            Run realistic technical interviews, get instant AI feedback, and
            turn weak topics into strengths.
          </p>
          <div className="hero-actions">
            <button
              className="primary-btn large"
              onClick={() => navigate("/setup")}
            >
              Start your interview <ArrowRight size={17} />
            </button>
            <button
              className="outline-btn large"
              onClick={() =>
                navigate(isAuthenticated ? "/history" : "/register")
              }
            >
              Explore your progress
            </button>
          </div>
          <div className="trust-row">
            <span>
              <CheckCircle2 size={15} /> Role-specific questions
            </span>
            <span>
              <CheckCircle2 size={15} /> Instant evaluation
            </span>
            <span>
              <CheckCircle2 size={15} /> Progress history
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="ai-core">
            <BrainCircuit size={56} />
            <span>AI</span>
          </div>
          <div className="floating-chip chip-a">
            <Code2 size={15} /> Node.js
          </div>
          <div className="floating-chip chip-b">
            <Target size={15} /> 92% score
          </div>
          <div className="floating-chip chip-c">
            <Mic2 size={15} /> Mock interview
          </div>
        </div>
      </section>
      <section className="feature-grid">
        <div>
          <h3>Targeted practice</h3>
          <p>
            Choose a role, tech stack and difficulty so every question has a
            purpose.
          </p>
        </div>
        <div>
          <h3>Actionable feedback</h3>
          <p>See what you did well, what you missed, and what to study next.</p>
        </div>
        <div>
          <h3>Build consistency</h3>
          <p>Review interview history and track your scores over time.</p>
        </div>
      </section>
    </div>
  );
}
