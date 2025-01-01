'use client'

import { createContext, useState, useContext, ReactNode } from 'react';

// Define types for context value
interface NumberContextType {
  metaMaskAddress: string | null;
  setMetaMaskAddress: (address: string | null) => void;
  number: string | null;
  setNumber: (number: string | null) => void;
}

// Create context with an explicit default value
const NumberContext = createContext<NumberContextType | undefined>(undefined);

// Provider component for both MetaMask address and number
export const NumberProvider = ({ children }: { children: ReactNode }) => {
  const [metaMaskAddress, setMetaMaskAddress] = useState<string | null>(null);
  const [number, setNumber] = useState<string | null>(null);

  return (
    <NumberContext.Provider value={{ metaMaskAddress, setMetaMaskAddress, number, setNumber }}>
      {children}
    </NumberContext.Provider>
  );
};

// Custom hook to access the context
export const useNumber = () => {
  const context = useContext(NumberContext);
  if (!context) {
    throw new Error('useNumber must be used within a NumberProvider');
  }
  return context;
};
