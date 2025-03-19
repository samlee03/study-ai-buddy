import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import "../styles/SignupPage.css"

const SignupPage = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

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
        } 
        catch {
            console.error(error)
        }
    }
    return (
        <div>
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