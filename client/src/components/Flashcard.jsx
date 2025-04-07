import React, { useState } from 'react';
import '../styles/Flashcard.css';
import { useTheme } from '../components/ThemeContext';

const Flashcard = ({ type = "normal", question, answer, options = []}) => {
  const { theme} = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userInput, setUserInput] = useState(""); 

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setIsCorrect(null); 
  };

  const handleCheckAnswer = (event) => {
    event.stopPropagation(); 
    if (selectedOption) {
      setIsCorrect(selectedOption === correctAnswer);
    }
    else if (type === "shortResponse") {
      setIsCorrect(userInput.trim().toLowerCase() === answer.toLowerCase());
    }
    setIsFlipped(true); 
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
    className={`flashcard ${isFlipped ? "flipped" : ""}`}
      onClick={type === "normal" ? handleFlip : undefined}>
      <div className="flashcard-content">
        {type === "normal" && (
          <>
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
          </>
        )}

        {type === "mc" && (
          <>
            {!isFlipped ? (
              <div className="flashcard-front">
                <p>{question}</p>
                <div className="options">
                  {options.map((option, index) => (
                    <label key={index} className="mc-option">
                      <input
                        type="radio"
                        name={`mc-${question}`}
                        value={option}
                        checked={selectedOption === option}
                        onChange={handleOptionChange}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <button
                  className="check-button"
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                >
                  Check
                </button>
                {isCorrect === false && <p className="incorrect">Incorrect. Try again!</p>}
              </div>
            ) : (
              <div className="flashcard-back">
                <p>{question}</p>
                <div className="options">
                  {options.map((option, index) => {
                    let className = "mc-option";
                    if (option === selectedOption) {
                      className += option === answer ? " correct" : " incorrect";
                    } else if (option === answer) {
                      className += " correct";
                    }

                    return (
                      <label key={index} className={className}>
                        <input type="radio" disabled checked={selectedOption === option} />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
        {type === "shortResponse" && (
           <>
             {!isFlipped ? (
               <div className="flashcard-front">
                 <p>{question}</p>
                 <textarea
                   value={userInput}
                   onChange={(e) => setUserInput(e.target.value)}
                   placeholder="Type your answer here..."
                   className="short-response-input"
                 />
                 <button className="check-button" onClick={handleCheckAnswer} disabled={!userInput.trim()}>
                   Check
                 </button>
                 {isCorrect === false && <p className="incorrect">Incorrect. Try again!</p>}
               </div>
             ) : (
               <div className="flashcard-back">
                 <p>{question}</p>
                 <p className={isCorrect ? "correct" : "incorrect"}>
                   {isCorrect ? "Correct!" : `Incorrect. The answer is: ${answer}`}
                 </p>
               </div>
             )}
           </>
         )}
         
      </div>
    </div>
  );
};

export default Flashcard;
