import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; // install: npm i js-cookie

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from cookies on refresh
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setUser({ token }); // you can fetch user details with token if needed
    }
  }, []);

  const login = (token) => {
    Cookies.set("token", token, { expires: 7 }); // expires in 7 days
    setUser({ token });
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
