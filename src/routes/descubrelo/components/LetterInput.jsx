import React, { useState } from 'react';

export const LetterInput = ({ onGuess, disabled, gender }) => {
  const [letter, setLetter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (letter.trim()) {
      onGuess(letter.trim());
      setLetter('');
    }
  };

  const focusColor = gender === 'boy' ? 'focus:border-blue-500' : 'focus:border-pink-500';
  const buttonColor = gender === 'boy' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-600 hover:bg-pink-700';

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        maxLength="1"
        value={letter}
        onChange={(e) => setLetter(e.target.value.toUpperCase())}
        disabled={disabled}
        className={`w-16 h-12 text-2xl text-center border-2 border-gray-300 rounded-lg ${focusColor} focus:outline-none disabled:bg-gray-100`}
        placeholder="_"
      />
      <button
        type="submit"
        disabled={disabled || !letter.trim()}
        className={`px-4 py-2 ${buttonColor} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Adivinar
      </button>
    </form>
  );
};
