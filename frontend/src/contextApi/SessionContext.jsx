import { createContext } from "react";
import { useState } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState("");
};

return (
  <SessionProvider.Provider value={{ sessionId, setSessionId }}>
    {children}
  </SessionProvider.Provider>
);
