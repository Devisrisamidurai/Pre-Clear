import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userRole: '',
  login: () => {},
  logout: () => {},
  setUserRole: () => {}
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const login = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
