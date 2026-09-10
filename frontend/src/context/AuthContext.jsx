import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize with stored or demo user
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem('saksham_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } else {
          // Pre-load default seeker demo profile
          const res = await api.switchDemoRole('user');
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('saksham_user', JSON.stringify(res.user));
          }
        }
      } catch (err) {
        console.warn('Backend offline or initializing; using local demo user', err);
        // Resilient offline fallback user
        const fallbackUser = {
          id: 'user-seeker-1',
          email: 'aarav@saksham.org',
          preferred_name: 'Aarav Sharma',
          is_anonymous: false,
          role: 'user',
          location: 'New Delhi, India',
          skills: ['Tailoring', 'Computer skills', 'Customer Support', 'Data Entry', 'Communication'],
          seeking_goals: ['Employment', 'Skill development', 'Government schemes', 'Mentorship']
        };
        setUser(fallbackUser);
        localStorage.setItem('saksham_user', JSON.stringify(fallbackUser));
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('saksham_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('saksham_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('saksham_user');
  };

  const switchRole = async (roleName) => {
    try {
      const res = await api.switchDemoRole(roleName);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('saksham_user', JSON.stringify(res.user));
      }
      return res.user;
    } catch (err) {
      console.error('Error switching demo role', err);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      await api.updateProfile(updatedData);
      setUser((prev) => {
        const nextUser = { ...prev, ...updatedData };
        localStorage.setItem('saksham_user', JSON.stringify(nextUser));
        return nextUser;
      });
    } catch (err) {
      console.error('Error updating profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        isEmployer: user?.role === 'employer',
        isAdmin: user?.role === 'admin',
        isMentor: user?.role === 'mentor'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
