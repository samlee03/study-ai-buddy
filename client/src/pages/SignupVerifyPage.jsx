import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import "../styles/SignupPage.css"
import { useTheme } from '../components/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from "../assets/Login.svg";
import Email from "../assets/email.png";



function SignupVerifyPage() {
    const { theme } = useTheme();
    const location = useLocation();
    const backendUrl = "https://study-ai-buddy-backend.onrender.com"

    const navigate = useNavigate();
    const { email, user, pw } = location.state
    const [input, setInput] = useState('')
    const handleVerify = async () => {
        const response = await fetch(`${backendUrl}/verify-code`, {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
                "email": email,
                "username": user,
                "pw": pw,
                "code": input
            })
        })
        if (response.ok){
            const data = await response.json()
            console.log(data)
            if (data.message == "this is the right code"){
                navigate('/login')
            }
        }
    }
  return (
    <div style={{
    '--primary' : theme.primary,
    '--secondary' : theme.secondary,
    '--background': theme.background,
    '--background2': theme.background2,
    '--title': theme.title,
    '--subtitle': theme.subtitle,
    '--text': theme.textColor,
    '--border': theme.border,
    '--buttonBackground' : theme.buttonBackground,
    '--buttonHover' : theme.buttonHover,
    '--buttonText' : theme.buttonText,
    '--buttonDisable' : theme.buttonDisable,
    '--boxShadow': theme.boxShadow
    }}
    className='AccountPage-Main'
    >
        <Header />

        <div className="Page-container">
                <div className="Form-block">
                    <div className="Login-image">
                        <img className="Login-image-file" src={Login}></img>
                    </div>
                    <div className="Form-container">
                        <h1 className="Login-header">Verify Email</h1>
                        <form onSubmit={(e) => {e.preventDefault(); handleVerify()}}>
                            <div className="input-container">
                                <img src={Email} alt="Email Icon" className="input-icon" />
                                <input type='text' value={input} onChange={e => setInput(e.target.value)} placeholder="Enter Code.."></input>
                            </div>
                            <input type="submit" value="Verify"></input>
                        </form>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default SignupVerifyPage