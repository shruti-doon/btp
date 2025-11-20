import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const cookieUser = Cookies.get('username');
    if (cookieUser) {
      setIsAuthenticated(true);
      setUsername(cookieUser);
    }
    setLoading(false); // DONE checking cookies
  }, []);

  const login = (name) => {
    setIsAuthenticated(true);
    setUsername(name);
    Cookies.set('username', name, { expires: 7 });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    Cookies.remove('username');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
