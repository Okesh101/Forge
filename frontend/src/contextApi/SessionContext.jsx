import { createContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();
  const BACKEND_API = "http://127.0.0.1:5000/api";
  const handleNavigation = () => {
    navigate("/");
  };
  return (
    <SessionContext.Provider
      value={{ sessionId, setSessionId, BACKEND_API, handleNavigation }}
    >
      {children}
    </SessionContext.Provider>
  );
};
