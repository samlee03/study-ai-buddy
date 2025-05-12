import React, { useState } from 'react';
import '../styles/EditFlashcard.css';

const EditFlashcardNormal = ({ term: initialTerm, definition: initialDefinition, onSave }) => {
  const [term, setTerm] = useState(initialTerm);
  const [definition, setDefinition] = useState(initialDefinition);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleTermChange = (e) => {
    setTerm(e.target.value);
  };

  const handleDefinitionChange = (e) => {
    setDefinition(e.target.value);
  };

  const handleSave = () => {
    onSave(term, definition);
  };

  return (
    <
      div className="EditFlashcard"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="EditFlashcardRow">
        <label className="EditFlashcardLabel">Term</label>
        <input
          type="text"
          id="term"
          value={term}
          onChange={handleTermChange}
          placeholder="Enter term"
          className='EditFlashcardInput'
        />
      </div>
      <div className="EditFlashcardRow">
        <label className="EditFlashcardLabel">Definition</label>
        <textarea
          id="definition"
          value={definition}
          onChange={handleDefinitionChange}
          placeholder="Enter definition"
          className='EditFlashcardTextArea'
        />
      </div>
      {isHovered && (
        <button className="SaveButton" onClick={handleSave}>Save</button>
      )}
    </div>
  );
};

export default EditFlashcardNormal;
