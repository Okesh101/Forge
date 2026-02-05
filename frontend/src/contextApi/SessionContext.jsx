import { createContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  // State to hold session ID and BACKEND_API
  const [sessionId, setSessionId] = useState("");

  // Navigate function for redirection
  const navigate = useNavigate();

  // Backend API URL
  const BACKEND_API = "http://127.0.0.1:5000";

  // Function to handle navigation to landing page
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
