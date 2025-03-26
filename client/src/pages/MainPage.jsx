import React, { useState, useEffect } from 'react';
import Header from '../components/Header'
import NewUpload from '../components/NewUpload'; 
import RecentUpload from '../components/RecentUpload'; 
import '../styles/MainPage.css';
import { useTheme } from '../components/ThemeContext';
import logo from "../assets/RobotHead.svg"
import CheckAuth from '../components/CheckAuth';

const MainPage = () => {
    const { isLoggedIn } = CheckAuth()
    // const isLoggedIn = true; // If you want to grant permission always for testing
    
    const { theme} = useTheme();
    const [uploadTypes, setUploadTypes] = useState([]);
    const [recentUploads, setRecentUploads] = useState([]);
    
    useEffect(() => {
      // Fetch upload types
      if (isLoggedIn){
        fetch("http://localhost:5000/api/uploadType")
          .then(response => response.json())
          .then(data => setUploadTypes(data.UploadTypes))
          .catch(error => console.error("Error fetching upload types:", error));
        // Fetch recent uploads
        fetch("http://localhost:5000/api/tempUploads")
          .then(response => response.json())
          .then(data => setRecentUploads(data.tempUploads))
          .catch(error => console.error("Error fetching recent uploads:", error));
      }
    }, [isLoggedIn]);
    if (isLoggedIn){
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
          <div className="Page-container-Main">
              <div className='Upload-page'>
                  <h2>New Upload</h2>
                  <div className='NewUploadContainer'>
                      {uploadTypes.map((type, index) => (
                          <NewUpload 
                              key={index}
                              title={type.title}
                              subtitle={type.subtitle}
                              image={logo}
                          />
                      ))}
                  </div>
                      <hr className="divider" />
                      <h2>Recent Upload</h2>
                      <div className='RecentUploadContainer'>
                          {recentUploads.map((upload, index) => (
                              <RecentUpload
                                  key={index}
                                  title={upload.title}
                                  subtitle={upload.subtitle}
                                  image={logo}
                                  type={upload.type}
                              />
                          ))}
                      </div>   
                  </div>
              </div>
          </div>
      )
  }
}

export default MainPage