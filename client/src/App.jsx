import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";


import Home from './pages/Home'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Main from './pages/MainPage';

const Shortcuts = () => {
  const navigate = useNavigate();
  return (
    <div className="shortcuts">
      <h2>navbar(for testing)</h2>
      <p onClick={() => navigate("/")}>Landing Page</p>
      <p onClick={() => navigate("/login")}>Login Page</p>
      <p onClick={() => navigate("/signup")}>Signup Page</p>
      <p onClick={() => navigate("/main")}>Main Page</p>
    </div>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Shortcuts/>
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="main" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
