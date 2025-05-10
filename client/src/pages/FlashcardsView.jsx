import React, { useState, useEffect } from 'react';
import Header from '../components/Header'
import EditFlashcardNormal from '../components/EditFlashcardNormal';
import EditFlashcardMC from '../components/EditFlashcardMC';
import EditFlashcardShortResponse from '../components/EditFlashcardShortResponse'; 
import { useTheme } from '../components/ThemeContext';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../styles/FlashcardsView.css';

const FlashcardsView = () => {
    const { theme} = useTheme();
    const navigate = useNavigate();
    const location = useLocation(); 
    const [title, setTitle] = useState(location.state?.title || '');
    const [subtTitle, setSubtTitle] = useState(location.state?.subtTitle || '');
    const flashcardType = location.state?.type || 'normal';
    const flashcardContent = location.state?.content;

    const card_id = location.state?.id;

    const [flashcards, setFlashcards] = useState(flashcardContent);
    const [isAddingCard, setIsAddingCard] = useState(false);

    const handleSaveFlashcard = async (index, newTerm, newDefinition) => {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[index] = { front: newTerm, back: newDefinition };
       
      setFlashcards(updatedFlashcards);
      const response = await fetch('http://localhost:5000/api/save_card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            "id": card_id,
            "type": "normal",
            "title": title,
            "subtitle": subtTitle,
            new_content: updatedFlashcards
        })
      })
      if (response.ok) {
        const data = await response.json();
        console.log('Server Response:', data);
      } else {
        const data = await response.json();
        console.error('Error:', data);
      }

    };
    const handleSaveMCQ = async (index, newQuestion, newOptions, newAnswer) => {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[index] = { question: newQuestion, options: newOptions, answer: newAnswer };
      
      setFlashcards(updatedFlashcards);
      const response = await fetch('http://localhost:5000/api/save_card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            "id": card_id,
            "title": title,
            "subtitle": subtTitle,
            "type": "question",
            new_content: updatedFlashcards
        })
      })
      if (response.ok) {
        console.log('Saving:', { newQuestion, newOptions, newAnswer });

        const data = await response.json();
        console.log('Server Response:', data);
      } else {
        const data = await response.json();
        console.error('Error:', data);
      }

    };

    const handleSaveShortResponse = async (index, newQuestion, newAnswer) => {
        const updatedFlashcards = [...flashcards];
        updatedFlashcards[index] = { question: newQuestion, answer: newAnswer };
         
        setFlashcards(updatedFlashcards);
        const response = await fetch('http://localhost:5000/api/save_card', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
              "id": card_id,
              "type": "shortResponse",
              "title": title,
              "subtitle": subtTitle,
              new_content: updatedFlashcards
          })
        })
        if (response.ok) {
          const data = await response.json();
          console.log('Server Response:', data);
        } else {
          const data = await response.json();
          console.error('Error:', data);
        }
  
      };

    const setNewFlashcard = (type, param1, param2) => {
      console.log("Set");
      if (type == "normal"){
        setFlashcards(prev => [...prev, {"front": param1, "back": param2}])
        handleSaveFlashcard(flashcards.length, param1, param2);
        setIsAddingCard(false);
      }
    }
    const setNewMCQ = (question, options, answer) => {
      setFlashcards(prev => [...prev, { question: question, options: options, answer: answer }]);
      handleSaveMCQ(flashcards.length, question, options, answer); 
      setIsAddingCard(false);
    }
    const setNewShortResponse = (question, answer) => {
        setFlashcards(prev => [...prev, {"question": question, "answer": answer}])
        handleSaveShortResponse(flashcards.length, question, answer);
        setIsAddingCard(false);
    }
    const handleViewClick = () => {
        navigate('/FlashcardPage', { state: { flashcardType, flashcards } });
    };

    const newFlashcard = {
        front : "",
        back : "",
        question : "",
        answer : "",
        options : [""],
    }
    useEffect(() => {
        console.log("Card ID: ", card_id);
        console.log("Flashcards: ", flashcards)
    }, [])
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
                '--boxShadow': theme.boxShadow
            }}
            className='FlashcardsView'
        >
            <Header />
            <div className='TitleRow'>
                <input
                    className="TitleInput"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                />
                
                <input
                    className="SubtitleInput"
                    type="text"
                    value={subtTitle}
                    onChange={(e) => setSubtTitle(e.target.value)}
                    placeholder="Enter subtitle"
                />
            </div>
            
           

            <div className='EditableFlashcardContainer'>
                <button className="ViewButton" onClick={handleViewClick}>
                    Study
                </button>
                {flashcardType === 'normal' && (
                    flashcards.map((flashcard, index) => (
                        <EditFlashcardNormal
                            key={index}
                            term={flashcard.front}
                            definition={flashcard.back}
                            onSave={(newTerm, newDefinition) => handleSaveFlashcard(index, newTerm, newDefinition)}
                        />
                    ))
                )}
                {flashcardType === 'question' && (
                    flashcards.map((flashcard, index) => (
                        <EditFlashcardMC
                            key={index}
                            question={flashcard.question}
                            options={flashcard.options}
                            answer={flashcard.answer}
                            onSave={(newQuestion, newOptions, correctAnswer) => handleSaveMCQ( index, newQuestion, newOptions, correctAnswer)}
                        />
                    ))
                )}
                {flashcardType === 'shortResponse' && (
                    flashcards.map((flashcard, index) => (
                        <EditFlashcardShortResponse
                            key={index}
                            question={flashcard.question}
                            answer={flashcard.answer}
                            onSave={(newQuestion, newAnswer) => handleSaveShortResponse(index, newQuestion, newAnswer)}
                        />
                    ))
                )}

                {isAddingCard && (
                    <div>
                        {flashcardType === 'normal' && (
                            <EditFlashcardNormal
                                term={newFlashcard.front}
                                definition={newFlashcard.back}
                                onSave={(newTerm, newDefinition) => setNewFlashcard('normal', newTerm, newDefinition)}
                            />
                        )}

                        {flashcardType === 'question' && (
                            <EditFlashcardMC
                                question={newFlashcard.question}
                                options={newFlashcard.options}
                                onSave={(newQuestion, newOptions, newAnswer) => setNewMCQ(newQuestion, newOptions, newAnswer)}
                            />
                        )}

                        {flashcardType === 'shortResponse' && (
                            <EditFlashcardShortResponse
                                question={newFlashcard.question}
                                answer={newFlashcard.answer}
                                onSave={(newQuestion, newAnswer) => setNewShortResponse(newQuestion, newAnswer)}
                            />
                        )}
                    </div>
                )}

                <button onClick={() => setIsAddingCard(!isAddingCard)} className="AddCardButton">
                    {isAddingCard ? 'Cancel' : 'Add New Card'}
                </button>
            </div>
        </div>
    )
}

export default FlashcardsView