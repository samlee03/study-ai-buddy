import React from 'react'
import Header from '../components/Header'
import "../styles/ForgotPassword.css"
import { useTheme } from '../components/ThemeContext';

const ForgotPassword = () => {
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
                        <p className="Forgot-instructions">Please enter your email to receive instructions for resetting your password.</p><br></br>
                        <form>
                            <label htmlFor="forgot-email">Email:</label><br></br>
                            <input type="email"></input><br></br>
                            <input type="submit" value="Submit"></input>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword