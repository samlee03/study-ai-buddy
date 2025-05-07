import React, { useState } from 'react';
import '../styles/EditFlashcard.css';
import Trashcan from "../assets/Trashcan.png"
import Add from "../assets/Add2.png"

const EditFlashcardMC = ({ question: initialQuestion, options: initialOptions, answer: initialCorrectAnswer, onSave }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [options, setOptions] = useState(initialOptions || []);
  const [correctAnswer, setCorrectAnswer] = useState(initialCorrectAnswer);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (index, e) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSave = () => {
    onSave(question, options, correctAnswer);
  };

  return (
    <div className="EditFlashcard">
      <div className="EditFlashcardRow">
        <label className="EditFlashcardLabel">Question</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter question"
          className="EditFlashcardInput"
        />
      </div>

      {/* {(options.length || 1) && options.map((option, index) => ( */}
      {(options?.length > 0) && options?.map((option, index) => (
          <div className="EditFlashcardRow" key={index}>
              <label className="EditFlashcardLabel">Option {index + 1}</label>
              <input
                  type="text"
                  id={`option-${index}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e)}
                  placeholder={`Enter option ${index + 1}`}
                  className="EditFlashcardInput"
              />
              <button type="button" className="RemoveOptionButton" onClick={() => handleRemoveOption(index)}>
                <img src={Trashcan} alt="Remove"/>
              </button>
          </div>
      ))}

      <button className="AddOptionButton" onClick={handleAddOption}>
       <img src={Add} alt="Add"/>
      </button>

      <div className="EditFlashcardRow">
        <label className="EditFlashcardLabel">Correct Answer</label>
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="EditFlashcardInput"
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button className="SaveButton" onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditFlashcardMC;