import React, { useState, useEffect } from 'react';
import Header from '../components/Header'
import NewUpload from '../components/NewUpload'; 
import RecentUpload from '../components/RecentUpload'; 
import '../styles/MainPage.css';
import logo from "../assets/StudyBuddyIcon.png"

const MainPage = () => {
    const [uploadTypes, setUploadTypes] = useState([]);
    const [recentUploads, setRecentUploads] = useState([]);
  
    useEffect(() => {
      // Fetch upload types
      fetch("http://localhost:5000/api/uploadType")
        .then(response => response.json())
        .then(data => setUploadTypes(data.UploadTypes))
        .catch(error => console.error("Error fetching upload types:", error));
  
      // Fetch recent uploads
      fetch("http://localhost:5000/api/tempUploads")
        .then(response => response.json())
        .then(data => setRecentUploads(data.tempUploads))
        .catch(error => console.error("Error fetching recent uploads:", error));
    }, []);

    return (
        <div>
            <Header />
        <div className="Page-container">
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

export default MainPage