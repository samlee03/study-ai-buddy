import React from 'react'
import "../styles/Header.css"
const Header = () => {
  return (
    <div className="Header">
      <p>Header</p>
      <div className="Header-buttons">
        <button className="Sign-in-button">Sign In</button>
        <button className="Register-button">Register</button>
      </div>
    </div>
  )
}

export default Header