import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Bluish
    const [theme] = useState({
      primary: "#ffffff",
      secondary: "#004981",
      background: "#dcecf3",
      background2 : "#c0dde8",
      title: "#075e85",
      subtitle: "#a6a7a4",
      textColor: "#075e85",
      headerBackground : "#ffffff",
      buttonBackground: "#66a0d4",
      buttonHover: "#7fdbf5",
      buttonText: "#ffffff",
      buttonDisable: "#012f5d",
      border : "#000000",
      boxShadow : "#000000",
    });

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContext;