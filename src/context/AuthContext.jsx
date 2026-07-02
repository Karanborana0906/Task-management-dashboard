import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  // Load logged-in user on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);

      const userData = response.data.data;
      const token = userData.token;

      setToken(token);
      setUser(userData);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed",
      };
    }
  };

  setToken(null);
  setUser(null);

  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // TODO: Call logout API when backend is ready
  // await authApi.logout();
};

// Register function
const register = async (userData) => {
  try {
    const response = await authApi.register(userData);

    const newUser = response.data.data;
    const token = newUser.token;

    setToken(token);
    setUser(newUser);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(newUser));

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Registration failed",
    };
  }
};

// Update user function
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