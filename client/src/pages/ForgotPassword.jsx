import React from 'react'
import Header from '../components/Header'
import "../styles/ForgotPassword.css"

const ForgotPassword = () => {
    return (
        <div>
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