import { useState, useEffect } from "react";
import { AuthContext } from "./auth-context";
import { getProfile } from "../services/authService";

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let active = true;

    getProfile()
      .then(({ data }) => {
        if (!active) return;

        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
