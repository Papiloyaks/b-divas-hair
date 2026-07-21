import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bdivas_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/profile")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("bdivas_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("bdivas_token", data.token);
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("bdivas_token", data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("bdivas_token");
    setUser(null);
  };

  // Merges fresh fields into the current user without needing a re-login —
  // used after editing profile details or preferences.
  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
