import React, { useEffect } from 'react';
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";


import Home from './pages/Home'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UploadPage from './pages/UploadPage';
import Main from './pages/MainPage';
import FlashcardPage from './pages/FlashcardPage';
import FlashcardsView from './pages/FlashcardsView';
import { ThemeProvider } from './components/ThemeContext';
import SignupVerifyPage from './pages/SignupVerifyPage';

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
          <ScrollToTop/>
          <Routes>
            <Route index element={<Home />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="verify" element={<SignupVerifyPage />} />
            <Route path="upload/:type" element={<UploadPage />} />
            <Route path="upload" element={<Main />} />
            <Route path="main" element={<Main />} />
            <Route path="FlashcardPage" element={<FlashcardPage />} />
            <Route path="flashcardsView" element={<FlashcardsView />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
