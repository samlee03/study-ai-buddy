import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import "../styles/LoginPage.css"
import { useTheme } from '../components/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CheckAuth from '../components/CheckAuth';
import Login from "../assets/Login.svg";
import Email from "../assets/email.png";
import Key from "../assets/key.png";


const LoginPage = () => {
    const { isLoggedIn } = CheckAuth();
    const {theme} = useTheme();
    const backendUrl = "http://localhost:5000"
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const handleSubmit = async () => {
        let body = {
            "username": username,
            "password": password
        }

        try {
            const response = await fetch(`${backendUrl}/db/login`, {
                method: 'POST',
                headers: {'Content-Type': "application/json"},
                credentials: 'include',
                body: JSON.stringify(body)
            })
            if (!response.ok) throw new Error('Login Error');
            const data = await response.json()
            if (data.status){
                // console.log(data.status);
                setMessage("Username or password was incorrect");
            } else {
                // console.log(data.token)
                navigate('/main')
                setMessage("Signed in. Redirect user to main page.")
            }
        } 
        catch {
            console.error(error)
        }
    }
    useEffect (() => {
        if (isLoggedIn){
            navigate('/main')
        }
    }, [isLoggedIn])
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
                    <div className="Form-container" onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
                        <h1 className="Login-header">Sign In</h1><br></br>
                        <form>
                            <div className="input-container">
                                <img src={Email} alt="Email Icon" className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                            {message ? <p className="sign-in-status">{message}<br></br></p> : <><br></br></>}
                            <input type="submit" value="Sign In" ></input>
                        </form>
                        <a className="Signup-link" href="./signup">{"Don't have an account?"}</a><br></br><br></br>
                        <a className="Forgot-link" href="./forgot">{"Forgot your password?"}</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage