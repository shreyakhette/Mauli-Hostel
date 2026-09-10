import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, studentApi, wardenApi } from '../api/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sakhi_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sakhi_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate session on load
    const verifyUser = async () => {
      if (token && user) {
        try {
          if (user.role === 'ROLE_STUDENT') {
            const profile = await studentApi.getProfile();
            const updated = { ...user, ...profile };
            setUser(updated);
            localStorage.setItem('sakhi_user', JSON.stringify(updated));
          } else if (user.role === 'ROLE_WARDEN') {
            const profile = await wardenApi.getProfile();
            const updated = { ...user, ...profile };
            setUser(updated);
            localStorage.setItem('sakhi_user', JSON.stringify(updated));
          }
        } catch (err) {
          console.warn('Session verification fallback', err);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    const authData = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
      fullName: data.fullName,
      studentId: data.studentId,
      roomNumber: data.roomNumber,
      bedLabel: data.bedLabel,
      designation: data.designation,
      profilePhotoUrl: data.profilePhotoUrl
    };

    localStorage.setItem('sakhi_token', data.token);
    localStorage.setItem('sakhi_user', JSON.stringify(authData));
    setToken(data.token);
    setUser(authData);
    return authData;
  };

  const register = async (registerData) => {
    const data = await authApi.register(registerData);
    const authData = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
      fullName: data.fullName,
      studentId: data.studentId,
      roomNumber: data.roomNumber,
      bedLabel: data.bedLabel
    };

    localStorage.setItem('sakhi_token', data.token);
    localStorage.setItem('sakhi_user', JSON.stringify(authData));
    setToken(data.token);
    setUser(authData);
    return authData;
  };

  const logout = () => {
    localStorage.removeItem('sakhi_token');
    localStorage.removeItem('sakhi_user');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('sakhi_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isStudent = user?.role === 'ROLE_STUDENT';
  const isWarden = user?.role === 'ROLE_WARDEN';
  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isStudent,
        isWarden,
        login,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
