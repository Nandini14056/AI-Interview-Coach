import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getApiError } from "@/components/ui/Toast";

export default function Auth({ mode = "login" }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isLogin) await signIn({ email: form.email, password: form.password });
      else await signUp(form);
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-logo">
          <BrainCircuit size={24} />
          <span>AI Interview Coach</span>
        </div>
        <div className="auth-card">
          <div className="auth-heading">
            <span className="eyebrow">AI-POWERED PRACTICE</span>
            <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
            <p>
              {isLogin
                ? "Continue sharpening your interview skills."
                : "Build confidence with realistic AI interviews."}
            </p>
          </div>
          <form onSubmit={submit} className="form-stack">
            {!isLogin && (
              <label>
                Username
                <div className="input-wrap">
                  <UserRound size={16} />
                  <input
                    required
                    minLength="3"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    placeholder="alexdev"
                  />
                </div>
              </label>
            )}
            <label>
              Email
              <div className="input-wrap">
                <Mail size={16} />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            </label>
            <label>
              Password
              <div className="input-wrap">
                <LockKeyhole size={16} />
                <input
                  required
                  minLength="6"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            {error && <div className="error-box">{error}</div>}
            <button className="primary-btn wide" disabled={busy}>
              {busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>
          <p className="auth-switch">
            {isLogin
              ? "New to AI Interview Coach?"
              : "Already have an account?"}{" "}
            <Link to={isLogin ? "/register" : "/login"}>
              {isLogin ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
