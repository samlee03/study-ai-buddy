import React from 'react'
import { useState, useEffect } from 'react'
import Flashcard from '../components/Flashcard'; 
import '../styles/FlashcardTest.css';


const FlashcardTest = () => {
  const [data, setData] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/test")  // Use the relative path
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  if (!data) {
    return <p>Loading...</p>; 
  }
  const nextCard = () => {
    if (data && currentIndex < data.questions.length - 1) {
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
          {data.questions.length > 0 && (
            <Flashcard
              question={data.questions[currentIndex].question}
              answer={data.questions[currentIndex].options.join(', ')}
            />
          )}
        </div>
      )}
      <div className="navigation">
        <button onClick={prevCard} disabled={currentIndex === 0}>
          Previous
        </button>

        <div className="flashcard-count">
          {currentIndex + 1} / {data.questions.length}
        </div>

        <button onClick={nextCard} disabled={currentIndex === data.questions.length - 1}>
          Next
        </button>
      </div>
    </div>
  );  
};

export default FlashcardTest