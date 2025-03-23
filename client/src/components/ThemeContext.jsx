import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    //Gray
    // const [theme, setTheme] = useState({
    //     primary: "#ffffff",
    //     secondary: "#f2f2f2",
    //     background: "#e6e6e6",
    //     title: "#000000",
    //     subtitle: "#5c5c5c",
    //     textColor: "#000000",
    //     headerBackground : "#ffffff",
    //     buttonBackground: "#cacccc",
    //     buttonHover: "#757575",
    //     buttonText: "#000000",
    //     buttonDisable: "#6b6b6b",
    //     border : "#cccccc",
    //     boxShadow : "#000000",
    // });
    const [theme, setTheme] = useState({
      primary: "#ffffff",
      secondary: "#004981",
      background: "#dcecf3",
      title: "#000000",
      subtitle: "#a6a7a4",
      textColor: "#000000",
      headerBackground : "#ffffff",
      buttonBackground: "#66a0d4",
      buttonHover: "#5786B0",
      buttonText: "#ffffff",
      buttonDisable: "#012f5d",
      border : "#000000",
      boxShadow : "#000000",
    });
    //bluish
    // const [theme, setTheme] = useState({
    //     primary: "#0062ad",
    //     secondary: "#004981",
    //     background: "#003257",
    //     title: "#ffffff",
    //     subtitle: "#bbbbbb",
    //     textColor: "#ffffff",
    //     headerBackground : "#0084e9",
    //     buttonBackground: "#099bcb",
    //     buttonHover: "#066382",
    //     buttonText: "#ffffff",
    //     buttonDisable: "#012f5d",
    //     border : "#113440",
    //     boxShadow : "#000000",
    // });

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContext;