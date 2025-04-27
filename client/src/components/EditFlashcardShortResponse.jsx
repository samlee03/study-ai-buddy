import React, { useState } from 'react';
import '../styles/EditFlashcard.css';

const EditFlashcardShortResponse = ({ question: initialQuestion, answer: initialAnswer, onSave }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSave = () => {
    onSave(question, answer);
  };

  return (
    <div className="EditFlashcard">
      <div className="EditFlashcardRow">
      <label className="EditFlashcardLabel">Question</label>
        <textarea
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter question"
          className="EditFlashcardTextArea"
        />
      </div>
      <div className="EditFlashcardRow">
      <label className="EditFlashcardLabel">Answer</label>
        <textarea
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Enter answer"
          className="EditFlashcardTextArea"
        />
      </div>
      <button className="SaveButton" onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditFlashcardShortResponse;
