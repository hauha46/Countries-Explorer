import React, { createContext, useContext, ReactNode } from 'react';
import { useCountries } from '@/hooks/useCountries';

// Create the context type based on useCountries return type
type CountriesContextType = ReturnType<typeof useCountries>;

// Create the context
const CountriesContext = createContext<CountriesContextType | undefined>(undefined);

// Provider component
interface CountriesProviderProps {
  children: ReactNode;
}

export const CountriesProvider = ({ children }: CountriesProviderProps) => {
  const countriesData = useCountries();
  
  return (
    <CountriesContext.Provider value={countriesData}>
      {children}
    </CountriesContext.Provider>
  );
};

// Custom hook to use the context
export const useCountriesContext = () => {
  const context = useContext(CountriesContext);
  if (context === undefined) {
    throw new Error('useCountriesContext must be used within a CountriesProvider');
  }
  return context;
};
