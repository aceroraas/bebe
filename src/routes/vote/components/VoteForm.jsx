import React from 'react';

export const VoteForm = ({
  selectedOption,
  currentVote,
  hasVoted,
  onVoteSelect,
  onConfirmVote
}) => {
  const isRemoving = hasVoted && selectedOption === null;
  const isChanging = hasVoted && selectedOption !== null && selectedOption !== currentVote;
  const buttonText = isRemoving ? 'Quitar Voto' : isChanging ? 'Cambiar Voto' : hasVoted ? 'Cambiar Voto' : 'Confirmar Voto';

  return (
    <div className="w-full">
      {hasVoted && (
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Tu voto actual: {currentVote === 'girl' ? 'Niña' : 'Niño'}
          </h3>
          <p className="text-gray-500 text-sm">Puedes cambiar o quitar tu voto</p>
        </div>
      )}

      <div className="space-y-4">
        <button
          className={`w-full py-3 px-6 rounded-lg transition-all ${
            selectedOption === 'girl'
              ? 'bg-pink-500 text-white'
              : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
          }`}
          onClick={() => onVoteSelect('girl')}
        >
          Niña
        </button>

        <button
          className={`w-full py-3 px-6 rounded-lg transition-all ${
            selectedOption === 'boy'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
          onClick={() => onVoteSelect('boy')}
        >
          Niño
        </button>

        <button
          className={`w-full py-3 px-6 rounded-lg transition-all ${
            isRemoving
              ? 'bg-red-500 text-white hover:bg-red-600'
              : selectedOption || hasVoted
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={onConfirmVote}
          disabled={!selectedOption && !hasVoted}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
