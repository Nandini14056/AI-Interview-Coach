import { useAuth } from "@/context/AuthContext";
export default function Settings() {
  const { user } = useAuth();
  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ACCOUNT</span>
          <h1>Settings</h1>
          <p>Basic account information used by your AI Interview Coach.</p>
        </div>
      </div>
      <div className="panel settings-panel">
        <label>
          Username
          <input value={user?.username || ""} readOnly />
        </label>
        <label>
          Email
          <input value={user?.email || ""} readOnly />
        </label>
        <label>
          Default target role
          <input
            placeholder="Set a role for future sessions"
            defaultValue={user?.targetRole || ""}
          />
        </label>
        <p className="muted">
          Profile editing is not exposed by the current backend API. Add an
          update-user endpoint when you want these fields persisted.
        </p>
      </div>
    </div>
  );
}
