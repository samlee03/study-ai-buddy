import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Flashcard from '../components/Flashcard'; 
import '../styles/FlashcardTest.css';

const FlashcardTest = () => {
  const location = useLocation(); 
  const flashcardType = location.state?.type || 'normal';
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
    if (flashcardType === "question" && data?.questions) {
      return data.questions.length;
    } else if (flashcardType === "normal" && data?.flashcards) {
      return data.flashcards.length;
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
    <div className="test-container">
      <h2>Flashcards</h2>
      {typeof data === 'undefined' ? (
        <p>Loading...</p> 
      ) : (
        <div className="flashcard-container">
          {flashcardType === "question" && getLength() > 0 && (
            <Flashcard
              key={currentIndex}
              question={
                <>
                  <strong>{data.questions[currentIndex].question}</strong>
                  <br />
                  <br />
                  {data.questions[currentIndex].options.map((option, index) => (
                    <span key={index}>
                      {String.fromCharCode(65 + index)}) {option}
                      <br />
                    </span>
                  ))}
                </>
              }
              answer={
                <>
                  {data.questions[currentIndex].options.map((option, index) => {
                    if (option === data.questions[currentIndex].answer) {
                      return (
                        <span key={index}>
                          {String.fromCharCode(65 + index)}) {option}
                        </span>
                      );
                    }})}
                </>
              }
            />
          )}
          {flashcardType === "normal" && getLength() > 0 && (
            <Flashcard
              key={currentIndex}
              question={<strong>{data.flashcards[currentIndex].front}</strong>}
              answer={data.flashcards[currentIndex].back}
            />
          )}
        </div>
      )}
      <div className="navigation">
        <button onClick={prevCard} disabled={currentIndex === 0}>
          Previous
        </button>

        <div className="flashcard-count">
          {currentIndex + 1} / {getLength()}
        </div>

        <button onClick={nextCard} disabled={currentIndex === getLength() - 1}>
          Next
        </button>
      </div>
    </div>
  );  
};

export default FlashcardTest