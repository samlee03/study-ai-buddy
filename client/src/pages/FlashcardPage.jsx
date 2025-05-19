import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Flashcard from '../components/Flashcard'; 
import Header from '../components/Header'
import '../styles/FlashcardPage.css';
import { useTheme } from '../components/ThemeContext';
import Shuffle from "../assets/shuffle.png"
import Regenerate from "../assets/regenerate.png"
import Checkmark from "../assets/checkmark.png"
import Xmark from "../assets/x.png"
import Chat from "../assets/Chat.svg"
import leftArrow from "../assets/rewind-button.png"
const FlashcardPage = () => {
  const {theme} = useTheme();
  const backendUrl = "http://localhost:5000"

  const location = useLocation(); 

  const title = location.state?.title || 'Flashcards';
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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [awaitAI, setAwaitAI] = useState(false)
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let apiUrl = `${backendUrl}/api/flashcards`; // Default API

    if (flashcardType === "question") {
      apiUrl = `${backendUrl}/api/questions`;
    } else if (flashcardType === "short-answer") {
      apiUrl = `${backendUrl}/api/short-answer-flashcards`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
    
  }, [flashcardType]);

  useEffect(() => {
    console.log(incorrectQuestions)
  },[incorrectQuestions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    const response = await fetch(`${backendUrl}/api/regenerate-flashcard`, {
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

  const handleUserSend = async () => {
    if (!input.trim()) return;
    setAwaitAI(true)
    const newMessages = [...messages, { sender: 'user', text: input }];
    let log = []
    newMessages.forEach((e) => log.push(e.text))
    console.log("Question: ", flashcardContent[currentIndex].question);

    setMessages(newMessages);
    setInput('');
    console.log(flashcardContent[currentIndex].question)
    const response = await fetch(`${backendUrl}/ask-studybuddy`, 
      {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "question": flashcardContent[currentIndex].question || flashcardContent[currentIndex].front,
          "chatlog": log
        })
      }
    )
    
    const data = await response.json();
    console.log(data.response)

    const botReply = { sender: 'ai', text: data.response };
    setMessages((prev) => [...prev, botReply]);
    setAwaitAI(false)
    // handleAIResponse(input);
  };

  const handleAIResponse = (userInput) => {
    const botReply = { sender: 'ai', text: `Some Ai response` };
    setMessages((prev) => [...prev, botReply]);
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
      <div className='Flashcard_ChatBot'>
        <div 
          style={{
            transform: isChatOpen ? 'scale(0.85)' : 'none',
            transition: 'transform 0.3s ease',
          }}
          className='FlashcardArea'
        >
            <div className="title-container">
              <div className="flashcard-title">{title}</div>
              <div className="ScoreSection">
              {isTrackingProgress ? (
                  <>
                    <h3 className="ScoreCorrect">Correct {correct}</h3>
                    <h3 className="ScoreIncorrect">Incorrect {incorrect}</h3>
                  </>

              ) : (
                <>
                  <div></div>
                  <div></div>
                </>
              )}
            </div>

          </div>
          {/* Use of AI, mainly for syntax for ternary operator */}
          {typeof data === 'undefined' ? (
            <p>Loading...</p> 
          ) : (
            <div className='flashcardSection'>
              <button className='ButtonArrow' onClick={prevCard} disabled={currentIndex === 0}>
                <img className="left-arrow-flashcard" src={leftArrow}></img>
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
                {/* {'>'} */}
                <img className="right-arrow-flashcard" src={leftArrow}></img>

              </button>
            </div>
          )}
          <div className='bottomControls'>
            <div className="navigation">
              {flashcardType !== "normal" && (
                <button className='imgOption tooltip' style={{ visibility: 'hidden' }}>
                  <img src={Regenerate} alt="regenerate"/>
                  <span class="tooltip-text">Regenerate cards based on wrong answers</span> 
                </button>
              )}
              <button className='imgOption tooltip' onClick={toggleProgressTracking}>
                {isTrackingProgress ? 'Stop Tracking' : 'Start Tracking'}
                <span class="tooltip-text">Track number of incorrect and correct answers for this flashcard set</span> 

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
                <div className='tooltip'>
                  <img src={Shuffle} alt="shuffle"/>
                   <span class="tooltip-text">Shuffle Cards</span> 
                </div>
              </button>
              {flashcardType !== "normal" && (
                <button className='imgOption tooltip' onClick={regenerateCards}>
                  <img src={Regenerate} alt="regenerate"/>
                  <span className="tooltip-text">Regenerate flashcards based on incorrect answers</span>
                </button>
              )}
            </div>
          </div>
          {!isChatOpen && (
            <div
              style={{
                marginLeft: 'auto',
              }}
            >
              <button
                onClick={() => setIsChatOpen(true)}
                className="toggleChatButton"
              >
                <img src={Chat} alt="Chat" />
              </button>
            </div>
          )}
        </div>
        {isChatOpen && (
          <div className="chat-panel">
            <div className="chat-container">
              <div className='chatUpper'>
                <div className='chatTitle'>Study Buddy AI</div>
                <button className="closeChatBot" onClick={() => setIsChatOpen(false)}>
                  <img src={Xmark} alt="closeChatBot"/>
                </button>
              </div>
              <div className="chat-history">
                <div className="chat-scroll">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={msg.sender === 'user' ? 'chat-message user' : 'chat-message bot'}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {awaitAI && (
                    <div className='chat-message bot'>
                      ...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="chat-input">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleUserSend();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={2}
                />
                <button onClick={handleUserSend}>Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );  
};

export default FlashcardPage