import React, { useState } from 'react';
import '../styles/Flashcard.css';

const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard-content">
        {!isFlipped && (
          <div className="flashcard-front">
            <p>{question}</p>
          </div>
        )}
        {isFlipped && (
          <div className="flashcard-back">
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
