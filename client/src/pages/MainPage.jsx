import React, { useState, useEffect } from 'react';
import Header from '../components/Header'
import NewUpload from '../components/NewUpload'; 
import RecentUpload from '../components/RecentUpload';
import RecentUploadHZ from '../components/RecentUploadHZ'; 
import '../styles/MainPage.css';
import { useTheme } from '../components/ThemeContext';
import { isToday, isYesterday, differenceInCalendarDays  } from 'date-fns';
import logo from "../assets/RobotHead.svg"
import CheckAuth from '../components/CheckAuth';
import flashcard from "../assets/Flashcard.png"
import multipleChoice from "../assets/MultipleChoice.png"
import shortResponse from "../assets/ShortResponse.png"

//Use of AI, a way to map the upload type to its corresponding image
const imageMap = {
    "normal": flashcard,
    "question": multipleChoice,
    "shortResponse": shortResponse,
  };

const MainPage = () => {
    const { isLoggedIn } = CheckAuth()
    // const isLoggedIn = true; // If you want to grant permission always for testing
    
    const { theme} = useTheme();
    // const backendUrl = "http://localhost:5000"
    const backendUrl = "https://study-ai-buddy-backend.onrender.com"


    const [recentUploads, setRecentUploads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFlashcard, setFilterFlashcard] = useState("All")
    const [recentLayout, setRecentLayout] = useState('List')
    
    const uploadTypes = [
      {
          "title" : "Flashcards",
          "type" : "normal",
          "subtitle" : "Great for memorization and self-testing in subjects like vocabulary, definitions, and key concepts.",
      },
      {
          "title" : "Multiple Choice Questions",
          "type" : "question",
          "subtitle" : "Useful for quizzes, practice tests, and self-assessment in areas where recognition-based learning is effective."
      },
      {
          "title" : "Short Responses",
          "type" : "shortResponse",
          "subtitle" : "Ideal for critical thinking, recall-based learning, and open-ended questions where written responses are necessary."
      }
    ]

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

    const displayedUploads = filteredUploads?.length > 0 ? filteredUploads.slice().reverse() : filteredUploads;

    const groupUploadsByDate = (uploads) => {
      const groups = {
        Today: [],
        Yesterday: [],
        'Last 7 Days': [],
        'Last 30 Days' : [],
        Earlier: [],
      };

      uploads.forEach(upload => {
        const date = new Date(upload.last_updated * 1000); 

        const diffDays = differenceInCalendarDays(new Date(), date);

        if (isToday(date)) {
          groups.Today.push(upload);
        } else if (isYesterday(date)) {
          groups.Yesterday.push(upload);
        } else if (diffDays <= 7) {
          groups['Last 7 Days'].push(upload);
        } else if (diffDays <= 30) {
          groups['Last 30 Days'].push(upload);
        } else {
          groups.Earlier.push(upload);
        }
      });

      Object.keys(groups).forEach(group => {
        groups[group].sort((a, b) => b.last_updated - a.last_updated);
      });

      return groups;
    }

    useEffect(() => {
      // Fetch upload types
      if (isLoggedIn){
        // Fetch recent uploads
        fetch(`${backendUrl}/db/get_saved_uploads`, {
            method: 'GET',
            credentials: 'include'
        })
          .then(response => response.json())
          .then(data => setRecentUploads(data.uploads))
          .catch(error => console.error("Error fetching recent uploads:", error));
      }
    }, [isLoggedIn]);

    useEffect(() => {
      console.log("recentUploads state:", recentUploads);
    }, [recentUploads]);

    if (isLoggedIn){
      return (
          <div
          //Use of AI, mainly for syntax
          style={{
              '--primary' : theme.primary,
              '--secondary' : theme.secondary,
              '--background': theme.background,
              '--background2': theme.background2,
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
                <h2>Create New</h2>
                <div className='NewUploadContainer'>
                    {uploadTypes.map((type, index) => (
                        <NewUpload 
                            key={index}
                            title={type.title}
                            subtitle={type.subtitle}
                            image={imageMap[type.type]}
                            type={type.type}
                        />
                    ))}
                </div>
                <hr className="divider" />
                <h2>Latest Activity</h2>
                <div>
                    <div className= 'RecentUploadFilter'>
                      <input
                        className ='searchBox'
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                      <button
                        className='FilterButton' 
                        onClick={() => {
                          const currentIndex = typeOptions.indexOf(filterFlashcard);
                          const nextIndex = (currentIndex + 1) % typeOptions.length;
                          setFilterFlashcard(typeOptions[nextIndex]);
                        }}
                      >
                        {filterFlashcard}
                      </button>
                      <button 
                        className='FilterButton'
                        onClick={() => {
                          setRecentLayout(recentLayout === 'List' ? 'Grid' : 'List')
                        }}
                      >
                        {recentLayout}
                      </button>
                    </div>
                  {recentLayout === 'Grid' ? (
                    <div className='RecentUploadContainer'>
                      {displayedUploads?.length > 0 ? (
                        displayedUploads.map((upload, index) => (
                          <RecentUpload
                            key={index}
                            id={upload.id}
                            title={upload.title}
                            subtitle={upload.subtitle}
                            image={imageMap[upload.type]}
                            type={upload.type}
                            content={upload.content}
                            last_updated={upload.last_updated}
                          />
                        ))
                      ) : (
                        <p>No uploads found.</p>
                      )}
                    </div>
                  ) : (
                    <div className="RecentUploadContainerHZ">
                      {Object.entries(groupUploadsByDate(displayedUploads || [])).map(([label, uploads]) =>
                        uploads.length > 0 ? (
                          <div key={label} className='SeparateByTime'>
                            <h3>{label}</h3>
                            {uploads.map((upload, index) => (
                              <RecentUploadHZ
                                key={upload.id || index}
                                id={upload.id}
                                title={upload.title}
                                subtitle={upload.subtitle}
                                image={imageMap[upload.type]}
                                type={upload.type}
                                content={upload.content}
                                last_updated={upload.last_updated}
                              />
                            ))}
                          </div>
                        ) : null
                      )}
                      {displayedUploads?.length === 0 && <p>No uploads found.</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      )
  }
}

export default MainPage