import React, { createContext, useContext, useMemo } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Always light mode now
  const contextValue = useMemo(
    () => ({
      theme: "light",
      toggleTheme: () => {}, // No-op
      isDark: false,
    }),
    [],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
