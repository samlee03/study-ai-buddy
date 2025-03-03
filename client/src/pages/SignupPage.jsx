import React from 'react'
import Header from '../components/Header'
import "../styles/SignupPage.css"

const SignupPage = () => {
    return (
        <div>
            <Header />
            <div className="Page-container">
                <form>
                    <label for="new-username">Username:</label><br></br>
                    <input type="text"></input><br></br>
                    <label for="email">Email:</label><br></br>
                    <input type="email"></input><br></br>
                    <label for="new-password">Password:</label><br></br>
                    <input type="password"></input><br></br>
                    <input type="submit" value="Sign Up"></input>
                </form>
            </div>
        </div>
    )
}

export default SignupPage