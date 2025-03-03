import React from 'react'
import Header from '../components/Header'
import "../styles/LoginPage.css"

const LoginPage = () => {
  return (
      <div>
          <Header />
          <div className="Page-container">
              <form>
                  <label for="username">Username:</label><br></br>
                  <input type="text"></input><br></br>
                  <label for="password">Password:</label><br></br>
                  <input type="password"></input><br></br>
                  <input type="submit" value="Login"></input>
              </form>
          </div>
      </div>
  )
}

export default LoginPage