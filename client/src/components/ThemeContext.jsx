import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    //Gray
    const [theme, setTheme] = useState({
        primary: "#ffffff",
        secondary: "#797a7a",
        background: "#d9d9d9",
        title: "#000000",
        subtitle: "#5c5c5c",
        textColor: "#000000",
        headerBackground : "#ffffff",
        buttonBackground: "#cacccc",
        buttonHover: "#757575",
        buttonText: "#000000",
        buttonDisable: "#6b6b6b",
        border : "#cccccc",
        boxShadow : "#000000",
    });
    //bluish
    // const [theme, setTheme] = useState({
    //     primary: "#84deff",
    //     secondary: "#0777a0",
    //     background: "#128fbd",
    //     title: "#000000",
    //     subtitle: "#005473",
    //     textColor: "#ffffff",
    //     headerBackground : "#9ae4ff",
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