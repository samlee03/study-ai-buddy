import React, { useState } from 'react';
import Header from '../components/Header'
import EditFlashcardNormal from '../components/EditFlashcardNormal';
import EditFlashcardMC from '../components/EditFlashcardMC';
import EditFlashcardShortResponse from '../components/EditFlashcardShortResponse'; 
import { useTheme } from '../components/ThemeContext';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../styles/FlashcardsView.css';

const FlashcardsView = () => {
    const {theme} = useTheme();
    const navigate = useNavigate();
    const location = useLocation(); 
    const [title, setTitle] = useState(location.state?.title || '');
    const [subtTitle, setSubtTitle] = useState(location.state?.subtTitle || '');
    const flashcardType = location.state?.type || 'normal';
    const flashcardContent = location.state?.content;

    const [flashcards, setFlashcards] = useState(flashcardContent);
    const [isAddingCard, setIsAddingCard] = useState(false);

    const handleSaveFlashcard = (index, newTerm, newDefinition) => {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[index] = { term: newTerm, definition: newDefinition };
      setFlashcards(updatedFlashcards);
    };

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
                    View
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
                            onSave={(newQuestion, newOptions) => handleSaveFlashcard(index, newQuestion, newOptions)}
                        />
                    ))
                )}
                {flashcardType === 'shortResponse' && (
                    flashcards.map((flashcard, index) => (
                        <EditFlashcardShortResponse
                            key={index}
                            question={flashcard.question}
                            answer={flashcard.answer}
                            onSave={(newQuestion, newAnswer) => handleSaveFlashcard(index, newQuestion, newAnswer)}
                        />
                    ))
                )}

                {isAddingCard && (
                    <div>
                        {flashcardType === 'normal' && (
                            <EditFlashcardNormal
                                term={newFlashcard.front}
                                definition={newFlashcard.back}
                                onSave={(newTerm, newDefinition) => setNewFlashcard({ term: newTerm, definition: newDefinition })}
                            />
                        )}

                        {flashcardType === 'question' && (
                            <EditFlashcardMC
                                question={newFlashcard.question}
                                options={newFlashcard.options}
                                onSave={(newQuestion, newOptions) => setNewFlashcard({ question: newQuestion, options: newOptions })}
                            />
                        )}

                        {flashcardType === 'shortResponse' && (
                            <EditFlashcardShortResponse
                                question={newFlashcard.question}
                                answer={newFlashcard.answer}
                                onSave={(newQuestion, newAnswer) => setNewFlashcard({ question: newQuestion, answer: newAnswer })}
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