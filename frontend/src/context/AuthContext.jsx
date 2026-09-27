import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const userData = await api.auth.getMe();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.error("Session verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Login — passes optional role to enforce portal-specific login
  const login = async (credentials) => {
    const data = await api.auth.login(credentials);
    setUser(data);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    return data;
  };

  // Register customer / admin
  const register = async (userData) => {
    const data = await api.auth.register(userData);
    setUser(data);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    return data;
  };

  // Register restaurant partner (separate endpoint that also creates Restaurant doc)
  const registerRestaurant = async (partnerData) => {
    const data = await api.auth.registerRestaurant(partnerData);
    setUser(data);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        registerRestaurant,
        logout,
        updateProfileState,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};