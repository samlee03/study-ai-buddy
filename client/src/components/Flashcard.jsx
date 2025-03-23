import React, { useState } from 'react';
import '../styles/Flashcard.css';
import { useTheme } from '../components/ThemeContext';

const Flashcard = ({ question, answer }) => {
  const { theme} = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
    className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
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
