import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Flashcard from '../components/Flashcard'; 
import Header from '../components/Header'
import '../styles/FlashcardPage.css';
import { useTheme } from '../components/ThemeContext';

const FlashcardTest = () => {
  const { theme} = useTheme();
  const location = useLocation(); 
  const flashcardType = location.state?.flashcardType || 'normal';
  const flashcardContent = location.state?.flashcards
  const [data, setData] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledContent, setShuffledContent] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);

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

  const shuffleCards = () => {
    const shuffled = [...flashcardContent];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledContent(shuffled);
    setIsShuffled(true);
  };

  return (
    <div 
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
    }}
    className="test-container">
      <Header />
      <h2>Flashcards</h2>
      {/* Use of AI, mainly for syntax for ternary operator */}
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
              question={isShuffled? shuffledContent[currentIndex].question : flashcardContent[currentIndex].question}
              options={isShuffled ? shuffledContent[currentIndex].options : flashcardContent[currentIndex].options}
              answer={isShuffled ? shuffledContent[currentIndex].answer : flashcardContent[currentIndex].answer}
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
              question={isShuffled ? shuffledContent[currentIndex].front : flashcardContent[currentIndex].front}
              answer={isShuffled ? shuffledContent[currentIndex].back : flashcardContent[currentIndex].back}
            />
          )}
          {flashcardType === "shortResponse" && getLength() > 0 && (
            <Flashcard
              type = "shortResponse"
              key={currentIndex}
              question={isShuffled ? shuffledContent[currentIndex].question : flashcardContent[currentIndex].question}
              answer={isShuffled ? shuffledContent[currentIndex].answer : flashcardContent[currentIndex].answer}
            />
          )}
        </div>
      )}
      <div className='bottomControls'>
        <div className='sideControls'>
          <button onClick={shuffleCards}>
            Shuffle
          </button>
        </div>
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
    </div>
  );  
};

export default FlashcardTest