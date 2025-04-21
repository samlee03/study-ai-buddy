import React, { useState, useEffect } from 'react';
import Header from '../components/Header'
import NewUpload from '../components/NewUpload'; 
import RecentUpload from '../components/RecentUpload'; 
import '../styles/MainPage.css';
import { useTheme } from '../components/ThemeContext';
import logo from "../assets/RobotHead.svg"
import CheckAuth from '../components/CheckAuth';
import flashcard from "../assets/Flashcard.svg"
import multipleChoice from "../assets/multipleChoice.svg"
import shortResponse from "../assets/Short Response.svg"

//Use of AI, a way to map the upload type to its corresponding image
const imageMap = {
    "normal": flashcard,
    "question": multipleChoice,
    "shortResponse": shortResponse,
  };

const MainPage = () => {
    const { isLoggedIn } = CheckAuth()
    // const isLoggedIn = true; // If you want to grant permission always for testing
    
    const {theme} = useTheme();
    const [uploadTypes, setUploadTypes] = useState([]);
    const [recentUploads, setRecentUploads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayRecent, setDisplayRecent] = useState(true);
    const [filterFlashcard, setFilterFlashcard] = useState("All")
    
    const typeOptions = ['All', 'Flashcard', 'Multiple Choice', 'Short Response'];
    const typeMapping = {
      All : "All",
      normal: 'Flashcard',
      question: 'Multiple Choice',
      shortResponse: 'Short Response',
    };
    const filteredUploads = recentUploads?.filter(upload =>
      (upload.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterFlashcard === 'All' || typeMapping[upload.type] === filterFlashcard)
    );

    const displayedUploads = displayRecent ? filteredUploads.slice().reverse() : filteredUploads;

    useEffect(() => {
      // Fetch upload types
      if (isLoggedIn){
        fetch("http://localhost:5000/api/uploadType")
          .then(response => response.json())
          .then(data => setUploadTypes(data.UploadTypes))
          .catch(error => console.error("Error fetching upload types:", error));
        // Fetch recent uploads
        fetch("http://localhost:5000/db/get_saved_uploads", {
            method: 'GET',
            credentials: 'include'
        })
          .then(response => response.json())
          .then(data => setRecentUploads(data.uploads))
          .catch(error => console.error("Error fetching recent uploads:", error));
      }
    }, [isLoggedIn]);

    if (isLoggedIn){
      return (
          <div
          //Use of AI, mainly for syntax
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
                              image={imageMap[type.type]}
                          />
                      ))}
                  </div>
                  <hr className="divider" />
                  <h2>Recent Upload</h2>
                  <div>
                      <div className= 'RecentUploadFilter'>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button
                          onClick={() => setDisplayRecent(prev => !prev)}
                        >
                        {displayRecent ? 'Newest' : 'Oldest'}
                        </button>
                        <button
                          onClick={() => {
                            const currentIndex = typeOptions.indexOf(filterFlashcard);
                            const nextIndex = (currentIndex + 1) % typeOptions.length;
                            setFilterFlashcard(typeOptions[nextIndex]);
                          }}
                        >
                          {filterFlashcard}
                        </button>
                      </div>
                    <div className='RecentUploadContainer'>
                      {displayedUploads?.length > 0 ? (
                        displayedUploads.map((upload, index) => (
                          <RecentUpload
                            key={index}
                            title={upload.title}
                            subtitle={upload.subtitle}
                            image={imageMap[upload.type]}
                            type={upload.type}
                            content={upload.content}
                          />
                        ))
                      ) : (
                        <p>No uploads found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
          </div>
      )
  }
}

export default MainPage