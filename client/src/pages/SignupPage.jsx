import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import "../styles/SignupPage.css"
import { useTheme } from '../components/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Login from "../assets/Login.svg";
import Email from "../assets/email.png";
import Key from "../assets/key.png";
import silhouette from "../assets/Silhouette.jpg"

const SignupPage = () => {
    const { theme} = useTheme();
    // const backendUrl = "http://localhost:5000"
    const backendUrl = "https://study-ai-buddy-backend.onrender.com"

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
            const response = await fetch(`${backendUrl}/db/register_user`, {
                method: 'POST',
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify(body)
            })
            if (!response.ok) throw new Error('Failed to extract text');
            const data = await response.json()
            console.log(data.status)
            if (data.status == "sent"){
                navigate('/verify', {state: { email: email, user: data.user, pw: data.pw_hashed }})
            }
            if (data.status == "Created user"){
                navigate('/login')
            }
        } 
        catch (error) {
            console.error(error)
        }
    }
    return (
        <div
        style={{
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
                        <div>
                            WELCOME!
                        </div>
                        <img className="Login-image-file" src={Login}></img>
                    </div>
                    <div className="Form-container">
                        <h1 className="Login-header">Sign Up</h1>
                        <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                            <div className="input-container">
                                <img src={silhouette} alt="Email Icon" className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="input-container">
                                <img src={Email} alt="Email Icon" className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="E-mail address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="input-container">
                                <img src={Key} alt="Password Icon" className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <input type="submit" value="Sign Up"></input>
                        </form>
                        <a className="Signup-link" href="./login">{"Already have an account? Sign in"}</a><br></br><br></br>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage