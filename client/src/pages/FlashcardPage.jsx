import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Flashcard from '../components/Flashcard'; 
import Header from '../components/Header'
import '../styles/FlashcardPage.css';
import { useTheme } from '../components/ThemeContext';
import Shuffle from "../assets/shuffle.png"
import Regenerate from "../assets/regenerate.png"
import Checkmark from "../assets/checkmark.png"
import Xmark from "../assets/x.png"

const FlashcardPage = () => {
  const {theme} = useTheme();
  const location = useLocation(); 
  const flashcardType = location.state?.flashcardType || 'normal';
  const [flashcardContent, setFlashcardContent] = useState(location.state?.flashcards || [])
  const card_id = location.state?.card_id
  const [data, setData] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledContent, setShuffledContent] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [resetFlipSignal, setResetFlipSignal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [answeredIndexes, setAnsweredIndexes] = useState([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [isTrackingProgress, setIsTrackingProgress] = useState(false);

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
  useEffect(() => {
    console.log(incorrectQuestions)
  },[incorrectQuestions])

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
    setResetFlipSignal(prev => prev + 1);
  };

  const regenerateCards = async () => {
    const response = await fetch('http://localhost:5000/api/regenerate-flashcard', {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: card_id,
        incorrect: incorrectQuestions,
        type: flashcardType
      })
    })
    if (response.ok){
      // Reset after regeneration
      console.log(flashcardType)
      console.log("DATA RECEIVED")
      const data = await response.json();
      setFlashcardContent(data["new-questions"])
      setCurrentIndex(0);
      setIsShuffled(false);
      setAnsweredIndexes([]);
      setIncorrectQuestions([]);
      setCorrect(0);
      setIncorrect(0);
      setResetFlipSignal(prev => prev + 1);
    }
  };
  
  const handleCorrectClick = () => {
    if (isTrackingProgress && !answeredIndexes.includes(currentIndex)) {
      setCorrect(prev => prev + 1);
      setAnsweredIndexes(prev => [...prev, currentIndex]);
    }
  };
  
  const handleIncorrectClick = () => {
    if (isTrackingProgress && !answeredIndexes.includes(currentIndex)) {
      setIncorrect(prev => prev + 1);
      setAnsweredIndexes(prev => [...prev, currentIndex]);
      setIncorrectQuestions(prev => [...prev, currentIndex])
    }
  };

  const handleShortResponseIncorrect = (question) => {
    if (isTrackingProgress && !answeredIndexes.includes(currentIndex)){
      setIncorrect(prev => prev + 1);
      setAnsweredIndexes(prev => [...prev, currentIndex]);
      setIncorrectQuestions(prev => [...prev, question])
    }
  }

  const toggleProgressTracking = () => {
    setIsTrackingProgress(prev => !prev);
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
      <div className="ScoreSection">
        {isTrackingProgress ? (
          <>
            <h3 className="ScoreCorrect">Correct {correct}</h3>
            <div className="flashcard-title">Flashcards</div>
            <h3 className="ScoreIncorrect">Incorrect {incorrect}</h3>
          </>
        ) : (
          <>
            <div />
            <div className="flashcard-title">Flashcards</div>
            <div /> 
          </>
        )}
      </div>
      {/* Use of AI, mainly for syntax for ternary operator */}
      {typeof data === 'undefined' ? (
        <p>Loading...</p> 
      ) : (
        <div className='flashcardSection'>
          <button className='ButtonArrow' onClick={prevCard} disabled={currentIndex === 0}>
            {'<'}
          </button>
          <div className="flashcard-container">
            {flashcardType === "question" && getLength() > 0 && (
              <Flashcard
                type="mc"
                key={currentIndex}
                resetFlipSignal={resetFlipSignal}
                question={isShuffled? shuffledContent[currentIndex].question : flashcardContent[currentIndex].question}
                options={isShuffled ? shuffledContent[currentIndex].options : flashcardContent[currentIndex].options}
                answer={isShuffled ? shuffledContent[currentIndex].answer : flashcardContent[currentIndex].answer}
                onIncorrect={(question) => handleShortResponseIncorrect(question)}
                onCorrect={handleCorrectClick}
              />
            )}
            {flashcardType === "normal" && getLength() > 0 && (
              <Flashcard
                type = "normal"
                key={currentIndex}
                resetFlipSignal={resetFlipSignal}
                question={isShuffled ? shuffledContent[currentIndex].front : flashcardContent[currentIndex].front}
                answer={isShuffled ? shuffledContent[currentIndex].back : flashcardContent[currentIndex].back}
                onIncorrect={(question) => handleShortResponseIncorrect(question)}

              />
            )}
            {flashcardType === "shortResponse" && getLength() > 0 && (
              <Flashcard
                type = "shortResponse"
                key={currentIndex}
                resetFlipSignal={resetFlipSignal}
                question={isShuffled ? shuffledContent[currentIndex].question : flashcardContent[currentIndex].question}
                answer={isShuffled ? shuffledContent[currentIndex].answer : flashcardContent[currentIndex].answer}
                onIncorrect={(question) => handleShortResponseIncorrect(question)}
                onCorrect={handleCorrectClick}
              />
            )}
          </div>
          <button className='ButtonArrow' onClick={nextCard} disabled={currentIndex === getLength() - 1}>
            {'>'}
          </button>
        </div>
      )}
      <div className='bottomControls'>
        <div className="navigation">
          {flashcardType !== "normal" && (
            <button className='imgOption' style={{ visibility: 'hidden' }}>
              <img src={Regenerate} alt="regenerate"/>
            </button>
          )}
          <button className='imgOption' onClick={toggleProgressTracking}>
            {isTrackingProgress ? 'Stop Tracking' : 'Start Tracking'}
          </button>
          {flashcardType === "normal" && isTrackingProgress && (
            <button className='imgOption' onClick={handleCorrectClick}>
              <img src={Checkmark} alt="correct" />
            </button>
          )}
          <div className="flashcard-count">
            {currentIndex + 1} / {getLength()}
          </div>
          {flashcardType === "normal" && isTrackingProgress && (
            <button className='imgOption' onClick={handleIncorrectClick}>
              <img src={Xmark} alt="incorrect"/>
            </button>
          )}
          <button className='imgOption' onClick={shuffleCards}>
            <img src={Shuffle} alt="shuffle"/>
          </button>
          {flashcardType !== "normal" && (
            <button className='imgOption' onClick={regenerateCards}>
              <img src={Regenerate} alt="regenerate"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );  
};

export default FlashcardPage