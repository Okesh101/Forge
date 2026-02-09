import { createContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  // State to hold session ID and BACKEND_API
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Navigate function for redirection
  const navigate = useNavigate();

  // Backend API URL
  const BACKEND_API = "https://forgev1.onrender.com";

  // Function to handle navigation to landing page
  const handleNavigation = () => {
    navigate("/");
  };
  return (
    <SessionContext.Provider
      value={{ sessionId, setSessionId, BACKEND_API, handleNavigation, isLoading, setIsLoading }}
    >
      {children}
    </SessionContext.Provider>
  );
};
