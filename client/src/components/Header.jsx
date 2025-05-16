import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/Header.css"
import { useTheme } from './ThemeContext';
import logo from "../assets/RobotHead.svg"
import silhouette from "../assets/Silhouette.jpg"
import CheckAuth from '../components/CheckAuth';

const Header = () => {
    const { isLoggedIn } = CheckAuth()
    const { theme } = useTheme();
    const location = useLocation();
    let navigate = useNavigate();
    const backendUrl = "http://localhost:5000"

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSignInClick = () => {
        navigate('/Login');
        setDropdownOpen(false);
    };

    const handleSignUpClick = () => {
        navigate('/signup');
        setDropdownOpen(false);
    };

    const LogoClick = () => {
        navigate('/');
    };

    const handleMainClick = () => {
        navigate('/main');
    };

    const getButtonClass = (path) => {
        return location.pathname === path ? 'Header-Button active' : 'Header-Button';
    };

    const handleLogOut = async () => {
        const response = await fetch(`${backendUrl}/api/clear-cookie`, {
            method: 'GET',
            credentials: 'include', // Src: ChatGPT, credentials must be 'include' to view/modify cookies in headers
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data.status);
            document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            navigate('/Login')
        }
    }
    return (
        <div style={{
            '--background': theme.headerBackground,
            '--text': theme.textColor,
            '--border': theme.border,
            '--buttonBackground': theme.buttonBackground,
            '--buttonHover': theme.buttonHover,
        }}
            className="Header">
            <div onClick={LogoClick} className="Logo-container">
                <img style={{ height: "50px", cursor: "pointer" }} className="Logo-img" src={logo} alt="Study Buddy"></img>
            </div>
            <div className="Nav-container">
                <button className={getButtonClass('/main')} onClick={handleMainClick}>
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
                            {!isLoggedIn ? <><button className="Dropdown-button" onClick={handleSignInClick}>Sign In</button><button className="Dropdown-button" onClick={handleSignUpClick}>Sign Up</button></>
                                : <button className="Dropdown-button" onClick={handleLogOut}>Log Out</button>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header