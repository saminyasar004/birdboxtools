import React, { createContext, useContext, useState, useEffect } from "react";

// Create AuthContext
const AppContext = createContext();

// Provide AuthContext to children
export const StateProvider = ({ children }) => {
    const [seminar, setSeminar] = useState(true);
    const [participant, setParticipant] = useState(false);
    const [assessment, setAssessment] = useState(false);
    const [mailSystem, setMailSystem] = useState(false);

  return (
    <AppContext.Provider value={{ seminar, setSeminar, participant, setParticipant, assessment, setAssessment, mailSystem, setMailSystem }}>
    {children}
  </AppContext.Provider>
  );
};

// Custom hook for accessing AuthContext
export const useCustomState = () => useContext(AppContext);
