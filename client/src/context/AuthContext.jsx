import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("accessToken")));

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    authService
      .getMe()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (payload) => {
    const res = await authService.login(payload);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res;
  };

  const signUp = async (payload) => {
    await authService.register(payload);
    return signIn({ email: payload.email, password: payload.password });
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } catch {
      //something went wrong
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
