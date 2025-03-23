import React, { useState } from 'react'
import Header from '../components/Header'
import "../styles/LoginPage.css"
import { useTheme } from '../components/ThemeContext';

const LoginPage = () => {
    const { theme} = useTheme();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
                body: JSON.stringify(body)
            })
            if (!response.ok) throw new Error('Login Error');
            const data = await response.json()
            if (data.status){
                console.log(data.status);
                setMessage("Wrong password");
            } else {
                console.log(data.token)
                setMessage("Signed in. Redirect user to main page.")
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