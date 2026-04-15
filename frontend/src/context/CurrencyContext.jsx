import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const currencyMap = {
  'USD ($)': '$',
  'EUR (€)': '€',
  'GBP (£)': '£',
  'INR (₹)': '₹',
  'JPY (¥)': '¥',
  'CAD (C$)': 'C$',
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'INR (₹)';
  });

  const [symbol, setSymbol] = useState(currencyMap[currency] || '₹');

  useEffect(() => {
    localStorage.setItem('currency', currency);
    setSymbol(currencyMap[currency] || '₹');
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
