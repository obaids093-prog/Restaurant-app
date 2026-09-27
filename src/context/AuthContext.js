import React, { createContext, useContext, useState, useEffect } from 'react';
import safeStorage from '../utils/safeStorage';
import { mockUsers } from '../data/users';

export const AuthContext = createContext(null);

const AUTH_USER_KEY = '@restaurant_app_auth_user';
const USERS_REGISTRY_KEY = '@restaurant_app_registered_users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(mockUsers);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Restore existing session and registered users on app startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUsers = await safeStorage.getItem(USERS_REGISTRY_KEY);
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          setRegisteredUsers([...mockUsers, ...parsed]);
        }

        const storedUser = await safeStorage.getItem(AUTH_USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn('Failed to restore auth session:', e);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    // 1000ms network delay simulation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const matchedUser = registeredUsers.find(
      (u) =>
        (u.email.toLowerCase() === cleanEmail ||
          (u.alternateEmail && u.alternateEmail.toLowerCase() === cleanEmail)) &&
        u.password === cleanPass
    );

    if (!matchedUser) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    // Never store plain password in active user session
    const safeUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      phone: matchedUser.phone || '',
      avatar: matchedUser.avatar || null,
    };

    setUser(safeUser);
    await safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  };

  const signup = async ({ name, email, password, role, phone }) => {
    // 1000ms network delay simulation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      role: role || 'customer',
      phone: phone ? phone.trim() : '0300-0000000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };

    const updatedRegistry = [...registeredUsers, newUser];
    setRegisteredUsers(updatedRegistry);

    // Save extra registered users to safeStorage
    const customUsers = updatedRegistry.filter((u) => !mockUsers.some((mu) => mu.id === u.id));
    await safeStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(customUsers));

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      avatar: newUser.avatar,
    };

    setUser(safeUser);
    await safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = async () => {
    setUser(null);
    try {
      await safeStorage.removeItem(AUTH_USER_KEY);
    } catch (e) {
      console.warn('Failed to clear auth session:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingAuth,
        login,
        signup,
        logout,
        registeredUsers,
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
