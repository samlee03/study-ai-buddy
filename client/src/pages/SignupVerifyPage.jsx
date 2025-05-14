import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import "../styles/SignupPage.css"
import { useTheme } from '../components/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';


function SignupVerifyPage() {
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { email, user, pw } = location.state
    const [input, setInput] = useState('')
    const handleVerify = async () => {
        const response = await fetch('http://localhost:5000/verify-code', {
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
    }}>
        <Header />
        <div className="Page-container">
            <div className="Form-block">
                <div className="Form-container">
                    <p>Enter code from email</p>
                    <input type='text' value={input} onChange={e => setInput(e.target.value)}></input>
                    <button onClick={handleVerify}>Verify</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignupVerifyPage