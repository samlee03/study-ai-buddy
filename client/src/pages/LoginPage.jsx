import React from 'react'
import Header from '../components/Header'
import "../styles/LoginPage.css"
import { useTheme } from '../components/ThemeContext';

const LoginPage = () => {
    const { theme} = useTheme();
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
                        <form>
                            <label htmlFor="username">Username:</label><br></br>
                            <input type="text"></input><br></br>
                            <label htmlFor="password">Password:</label><br></br>
                            <input type="password"></input><br></br>
                            <input type="submit" value="Sign In"></input>
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