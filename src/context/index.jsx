import { useContext, useState, createContext } from "react";

const ApplicationContext = createContext();

export function ApplicationContextProvider({ children }) {
  const [application, setApplication] = useState({});

  return (
    <ApplicationContext.Provider value={{ application, setApplication }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useMyApplicationContext() {
  return useContext(ApplicationContext);
}
