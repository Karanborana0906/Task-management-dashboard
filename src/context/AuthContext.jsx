import React, { createContext, useContext, useState, useEffect } from "react";
import authApi from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  // Load logged-in user on app start
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.getProfile();

        setToken(storedToken);
        setUser(response.data.data);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.data)
        );
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login
 const login = async (credentials) => {
  try {
    console.log("REAL LOGIN FUNCTION");
    console.log("Before Login API");

    const response = await authApi.login(credentials);

    console.log("Login API Response:", response);

    const { token, ...user } = response.data.data;

    setToken(token);
    setUser(user);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return { success: true };
  } catch (error) {
    console.log("Login Error:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
};

  // Register
 const register = async (userData) => {
  try {
    console.log("REAL REGISTER FUNCTION");
    console.log("Before Register API");

    const response = await authApi.register(userData);

    console.log("Register API Response:", response);

    const { token, ...user } = response.data.data;

    setToken(token);
    setUser(user);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return { success: true };
  } catch (error) {
    console.log("Register Error:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Registration failed",
    };
  }
};

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {}

    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Update user
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const isAuthenticated = () => !!token;

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export default AuthContext;