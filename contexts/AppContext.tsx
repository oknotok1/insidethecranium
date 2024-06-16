// contexts/MyContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define types for context state
type AppContextType = {
  isListening: boolean;
  setIsListening: Dispatch<SetStateAction<boolean>>;
};

// Create a context object with initial values
const MyContext = createContext<AppContextType>({
  isListening: false,
  setIsListening: () => {},
});

// Create a provider component
export const AppContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState<boolean>(false);

  return (
    <MyContext.Provider value={{ isListening, setIsListening }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => useContext(MyContext);
