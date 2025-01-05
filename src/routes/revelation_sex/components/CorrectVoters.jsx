import React from 'react';

export const CorrectVoters = ({ voters }) => {
  if (!voters || voters.length === 0) return null;

  return (
    <div className="mt-8 text-center">
      <h3 className="text-sm font-medium text-gray-500 mb-4">
        {voters.length} {voters.length === 1 ? 'persona acertó' : 'personas acertaron'} correctamente
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {voters.map((voter) => (
          <div
            key={voter.id}
            className="tooltip tooltip-top"
            data-tip={voter.displayName}
          >
            {voter.photoURL ? (
              <img
                src={voter.photoURL}
                alt={voter.displayName}
                className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white shadow-md hover:scale-110 transition-transform duration-200">
                {voter.displayName?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
