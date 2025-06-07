import { createContext, useContext, useEffect, useState, useRef } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [user, setUser] = useState(null);
  const inactivityTimeout = useRef(null);

  // Reset inactivity timer function
  const resetInactivityTimer = () => {
    // console.log("Reset inactivity timer");
    if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);

    inactivityTimeout.current = setTimeout(() => {
      // Auto logout after 2 minutes (120000 ms)
      logout();
    }, 2 * 60 * 1000);
  };

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    // console.log("Stored user on load:", storedUser);
    setIsAuthenticated(!!storedUser);
    setUser(storedUser);

    // Set listeners to reset inactivity timer on user activity
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("scroll", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);

    resetInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("scroll", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
    };
  }, []);

  const login = (userData) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    resetInactivityTimer();
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
