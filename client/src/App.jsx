import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";


import Home from './pages/Home'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import UploadPage from './pages/UploadPage';
import Main from './pages/MainPage';
import Test from './pages/Test';
import FlashcardPage from './pages/FlashcardPage';
import { ThemeProvider } from './components/ThemeContext';

// const Shortcuts = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="shortcuts">
//       <h2>navbar(for testing)</h2>
//       <p onClick={() => navigate("/")}>Home Page</p>
//       <p onClick={() => navigate("/login")}>Login Page</p>
//       <p onClick={() => navigate("/signup")}>Signup Page</p>
//       <p onClick={() => navigate("/upload")}>Upload Page</p>
//       <p onClick={() => navigate("/main")}>Main Page</p>
//       <p onClick={() => navigate('/test')}>Test</p>
//       <p onClick={() => navigate('/FlashcardTest')}>FlashcardTest</p>
//     </div>
//   )
// }

function App() {
  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          {/* <Shortcuts/> */}
          <Routes>
            <Route index element={<Home />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot" element={<ForgotPassword />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="main" element={<Main />} />
            <Route path="test" element={<Test />} />
            <Route path="FlashcardPage" element={<FlashcardPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
