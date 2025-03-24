import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import "../styles/SignupPage.css"
import { useTheme } from '../components/ThemeContext';
import { useNavigate } from 'react-router-dom';


const SignupPage = () => {
    const { theme} = useTheme();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const handleSubmit = async () => {
        let body = {
            "username": username,
            "email": email,
            "password": password
        }

        try {
            const response = await fetch('http://localhost:5000/db/register_user', {
                method: 'POST',
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify(body)
            })
            if (!response.ok) throw new Error('Failed to extract text');
            const data = await response.json()
            console.log(data.status)
            if (data.status == "Created user"){
                navigate('/login')
            }
        } 
        catch {
            console.error(error)
        }
    }
    return (
        <div
        style={{
            '--primary' : theme.primary,
            '--secondary' : theme.secondary,
            '--background': theme.background,
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
        >
            <Header />
            <div className="Page-container">
                <div className="Form-block">
               <div className="Form-container">
                <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                    <label htmlFor="new-username">Username:</label><br></br>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input><br></br>
                    <label htmlFor="email">Email:</label><br></br>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input><br></br>
                    <label htmlFor="new-password">Password:</label><br></br>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input><br></br>
                    <input type="submit" value="Sign Up"></input>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage