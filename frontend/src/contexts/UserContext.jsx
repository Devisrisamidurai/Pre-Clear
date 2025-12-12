import { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  clearUser: () => {}
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const updateUser = (u) => {
    setUser(u);
    try {
      if (u) localStorage.setItem('user', JSON.stringify(u));
      else localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
  };

  const clearUser = () => {
    setUser(null);
    try { localStorage.removeItem('user'); } catch(e) {}
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
