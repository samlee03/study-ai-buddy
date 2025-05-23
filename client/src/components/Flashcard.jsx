import React, { useState, useEffect } from 'react';
import '../styles/Flashcard.css';
import { useTheme } from '../components/ThemeContext';

const Flashcard = ({ type = "normal", question, answer, options = [], resetFlipSignal, onIncorrect, onCorrect }) => {
  const { theme} = useTheme();
  const backendUrl = "https://study-ai-buddy-backend.onrender.com"

  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userInput, setUserInput] = useState(""); 

  // For ShortResponse
  const [feedback, setFeedback] = useState('');
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  
  useEffect(() => {
    setIsFlipped(false);
  }, [resetFlipSignal]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setIsCorrect(null); 
  };

  const handleCheckAnswer = async (event) => {
    if (type == "mc"){
      const correctAnswer = selectedOption === answer;
      if (correctAnswer) {
        onCorrect()
      } else {
        onIncorrect(question)
      }
    }
    if (type == "shortResponse"){
      const response = await fetch(`${backendUrl}/api/check`, 
        { method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            "question": question,
            "answer": userInput 
          })
        }
      )
      if (response.ok){
        const data = await response.json()
        console.log(data);
        setFeedback(data.response);
        if (data.isCorrect !== "YES"){
          onIncorrect(question);
        } else {
          onCorrect()
        }
      } else {
        throw error;
      }
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
                <p className='flashcard-regular-question'>{question}</p>
              </div>
            )}
            {isFlipped && (
              <div className="flashcard-back">
                <p className='flashcard-regular-answer'>{answer}</p>
              </div>
            )}
          </>
        )}

        {type === "mc" && (
          <>
            {!isFlipped ? (
              <div className="flashcard-front">
                <p className="mc-question">{question}</p>
                <div className="options">
                  {options.map((option, index) => (
                    <label key={index} className="mc-option">
                      <input
                        type="radio"
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
                  Check Answer
                </button>
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
                 <p className="shortResponse-question">{question}</p>
                 <textarea
                   value={userInput}
                   onChange={(e) => setUserInput(e.target.value)}
                   placeholder="Type your answer here..."
                   className="short-response-input"
                 />
                 <button className="check-button" onClick={handleCheckAnswer} disabled={!userInput.trim()}>
                   Check
                 </button>
               </div>
             ) : (
               <div className="flashcard-back">
                 <p>{question}</p><br></br>
                 <p>Your response: {userInput} </p><br></br>
                 <p>Feedback: {feedback && feedback} </p>
               </div>
             )}
           </>
         )}

      </div>
    </div>
  );
};

export default Flashcard;
