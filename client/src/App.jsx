import React, { useEffect } from 'react';
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";


import Home from './pages/Home'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import UploadPage from './pages/UploadPage';
import Main from './pages/MainPage';
import Test from './pages/Test';
import FlashcardPage from './pages/FlashcardPage';
import FlashcardsView from './pages/FlashcardsView';
import { ThemeProvider } from './components/ThemeContext';
import MainPage from './pages/MainPage';
import SignupVerifyPage from './pages/SignupVerifyPage';

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

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  
  }, [location]); 

  return null;
}

function App() {
  return (
    <>
      
      <ThemeProvider>
        <BrowserRouter>
          {/* <Shortcuts/> */}
          <ScrollToTop/>
          <Routes>
            <Route index element={<Home />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="verify" element={<SignupVerifyPage />} />
            <Route path="forgot" element={<ForgotPassword />} />
            <Route path="upload/:type" element={<UploadPage />} />
            <Route path="upload" element={<Main />} />
            <Route path="main" element={<Main />} />
            <Route path="test" element={<Test />} />
            <Route path="FlashcardPage" element={<FlashcardPage />} />
            <Route path="flashcardsView" element={<FlashcardsView />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
