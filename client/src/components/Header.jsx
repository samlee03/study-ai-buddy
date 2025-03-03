import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/Header.css"
import logo from "../components/PlaceholderLogo.png"
const Header = () => {
    let navigate = useNavigate();
    const LogoClick = () => {
        navigate('/');
    };
  return (
      <div className="Header">
          <div onClick={LogoClick} classname="Logo-container"><img style={{ height: "75px" }} classname="Logo-img" src={logo} alt="Study Buddy"></img></div>
      <div className="Header-buttons">
        <button className="Sign-in-button">Sign In</button>
        <button className="Register-button">Register</button>
      </div>
    </div>
  )
}

export default Header