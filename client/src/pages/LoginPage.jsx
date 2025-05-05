import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import "../styles/LoginPage.css"
import { useTheme } from '../components/ThemeContext';
import { useNavigate } from 'react-router-dom';
import CheckAuth from '../components/CheckAuth';

const LoginPage = () => {
    const { isLoggedIn } = CheckAuth();
    const {theme} = useTheme();
    const navigate = useNavigate();
    const [username, setUsername] = useState("dummy1");
    const [password, setPassword] = useState("test123");
    const [message, setMessage] = useState("");
    const handleSubmit = async () => {
        let body = {
            "username": username,
            "password": password
        }

        try {
            const response = await fetch('http://localhost:5000/db/login', {
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
        >
            <Header />
            <div className="Page-container">
                <div className="Form-block">
                    <div className="Form-container" onSubmit={(e) =>{e.preventDefault();  handleSubmit()}}>
                        <form>
                            <label htmlFor="username">Username:</label><br></br>
                            <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}}></input><br></br>
                            <label htmlFor="password">Password:</label><br></br>
                            <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}></input>
                            {message ? <p className="sign-in-status">{message}<br></br></p> : <><br></br></>}
                            <br></br>
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