'use client';

const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';

export const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const getStoredUsername = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USERNAME_KEY);
  }
  return null;
};

export const setAuthData = (token: string, username: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
  }
};

export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
  }
};

export const redirectToLogin = () => {
  const idSystemUrl = import.meta.env.VITE_ID_SYSTEM_URL || process.env.NEXT_PUBLIC_ID_SYSTEM_URL;
  const redirectUri = import.meta.env.VITE_AUTH_REDIRECT_URI || process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI;
  
  if (idSystemUrl && redirectUri) {
    const loginUrl = `${idSystemUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
  } else {
    console.error('Auth configuration missing');
  }
};

export const logout = () => {
  clearAuthData();
  window.location.href = '/logout';
};
