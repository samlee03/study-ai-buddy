import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Header.css"
import { useTheme } from './ThemeContext';
import logo from "../assets/StudyBuddyIcon.png"
import silhouette from "../assets/Silhouette.jpg"
const Header = () => {
    const { theme} = useTheme();
    let navigate = useNavigate();
    
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSignInClick = () => {
        navigate('/Login');
        setDropdownOpen(false);
    };

    const LogoClick = () => {
        navigate('/');
    };

    const handleMainClick = () => {
      navigate('/main');
    };

    const handleTestClick = () => {
      navigate('/test');
    };
  return (
    <div style={{
      '--background': theme.headerBackground,
      '--text': theme.textColor,
      '--border': theme.border,
      '--buttonBackground' : theme.buttonBackground,
      '--buttonHover' : theme.buttonHover,
      }}
      className="Header">
      <div onClick={LogoClick} className="Logo-container">
        <img style={{ height: "75px" }} className="Logo-img" src={logo} alt="Study Buddy"></img>
      </div>
      <div className="Nav-container">
        <button className="Header-Button" onClick={handleTestClick}>
          Test
        </button>
        <button className="Header-Button" onClick={handleMainClick}>
          Dashboard
        </button>
        <div className="Profile-container">
          <img 
            src={silhouette} 
            alt="Profile" 
            className="Profile-img" 
            onClick={toggleDropdown}
            style={{ height: "50px", cursor: "pointer", borderRadius: "50%" }}
          />
          {dropdownOpen && (
            <div className="Dropdown-menu">
                <button className="Dropdown-button" onClick={handleSignInClick}>Sign In</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header