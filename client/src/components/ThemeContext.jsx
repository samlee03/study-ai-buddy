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

    //Grayscale
    // const [theme] = useState({
    //   primary: "#ffffff",
    //   secondary: "#4d4d4d",
    //   background: "#f2f2f2",
    //   background2: "#d9d9d9",
    //   title: "#1a1a1a",
    //   subtitle: "#808080",
    //   textColor: "#1a1a1a",
    //   headerBackground: "#ffffff",
    //   buttonBackground: "#bfbfbf",
    //   buttonHover: "#d9d9d9",
    //   buttonText: "#000000",
    //   buttonDisable: "#999999",
    //   border: "#000000",
    //   boxShadow: "#000000"
    // });

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContext;