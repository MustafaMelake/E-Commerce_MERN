import { useState, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./authContext";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email")
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (email: string, token: string) => {
    setEmail(email);
    setToken(token);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ email, token, login, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
