import React from 'react'
import Header from '../components/Header'
import "../styles/LoginPage.css"

const LoginPage = () => {
    return (
        <div>
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
                        <a className="Signup-link" href="./signup">{"Don't have an account?"}</a><br></br>
                        <a className="Forgot-link" href="./forgot">{"Forgot your password?"}</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage