import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Flashcard from '../components/Flashcard'; 
import Header from '../components/Header'
import '../styles/FlashcardTest.css';
import { useTheme } from '../components/ThemeContext';

const FlashcardTest = () => {
  const { theme} = useTheme();
  const location = useLocation(); 
  const flashcardType = location.state?.type || 'normal';
  const flashcardContent = location.state?.content
  const [data, setData] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    let apiUrl = "http://localhost:5000/api/flashcards"; // Default API

    if (flashcardType === "question") {
      apiUrl = "http://localhost:5000/api/questions";
    } else if (flashcardType === "short-answer") {
      apiUrl = "http://localhost:5000/api/short-answer-flashcards";
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
    
  }, [flashcardType]);

  if (!data) {
    return <p>Loading...</p>; 
  }

  const getLength = () => {
    if (flashcardType === "question") {
      return flashcardContent.length;
    } else if (flashcardType === "normal" && data?.flashcards) {
      return flashcardContent.length;
    } else if (flashcardType === "shortResponse" && data?.flashcards){
      return flashcardContent.length;
    } else {
      return 0;
    }
  };

  const nextCard = () => {
    if (data && currentIndex < getLength() - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

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
    }}
    className="test-container">
      <Header />
      <h2>Flashcards</h2>
      {/* Use of AI, mainly for syntax for if statement */}
      {typeof data === 'undefined' ? (
        <p>Loading...</p> 
      ) : (
        <div className="flashcard-container">
          {/* {flashcardType === "question" && getLength() > 0 && (
            <Flashcard
              type="mc"
              key={currentIndex}
              question= {data.questions[currentIndex].question}
              options= {data.questions[currentIndex].options}
              correctAnswer= {data.questions[currentIndex].answer}
            />
          )} */}
          {flashcardType === "question" && getLength() > 0 && (
            <Flashcard
              type="mc"
              key={currentIndex}
              question= {flashcardContent[currentIndex].question}
              options= {flashcardContent[currentIndex].options}
              answer= {flashcardContent[currentIndex].answer}
            />
          )}
          {/* {flashcardType === "normal" && getLength() > 0 && (
            <Flashcard
              type = "normal"
              key={currentIndex}
              question={data.flashcards[currentIndex].front}
              answer={data.flashcards[currentIndex].back}
            />
          )} */}
          {flashcardType === "normal" && getLength() > 0 && (
            <Flashcard
              type = "normal"
              key={currentIndex}
              question={flashcardContent[currentIndex].front}
              answer={flashcardContent[currentIndex].back}
            />
          )}
          {flashcardType === "shortResponse" && getLength() > 0 && (
            <Flashcard
              type = "shortResponse"
              key={currentIndex}
              question={flashcardContent[currentIndex].question}
              answer={flashcardContent[currentIndex].answer}
            />
          )}
        </div>
      )}
      <div className="navigation">
        <button onClick={prevCard} disabled={currentIndex === 0}>
          {'<'}
        </button>

        <div className="flashcard-count">
          {currentIndex + 1} / {getLength()}
        </div>

        <button onClick={nextCard} disabled={currentIndex === getLength() - 1}>
          {'>'}
        </button>
      </div>
    </div>
  );  
};

export default FlashcardTest