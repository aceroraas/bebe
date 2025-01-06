import React from 'react';

export const LetterBox = ({ letter, revealed, guesserPhotoURL, guesserName, gender }) => {
  const [imageError, setImageError] = React.useState(false);

  const borderColor = gender === 'boy' ? 'border-blue-400' : 'border-pink-400';
  const bgColor = gender === 'boy' ? 'bg-blue-600' : 'bg-pink-600';

  const renderAvatar = () => {
    if (imageError || !guesserPhotoURL) {
      return (
        <div className={`w-8 h-8 rounded-full ${bgColor} text-white flex items-center justify-center border-2 border-white shadow-sm`}>
          {guesserName?.charAt(0)?.toUpperCase() || '?'}
        </div>
      );
    }

    return (
      <img
        src={guesserPhotoURL}
        alt={guesserName || 'Avatar'}
        onError={() => setImageError(true)}
        className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 min-w-[3rem]">
      <div className={`w-12 h-12 border-b-2 ${borderColor} flex items-center justify-center text-2xl font-bold`}>
        {revealed ? letter : '_'}
      </div>
      {revealed && (
        <div
          className="tooltip tooltip-bottom"
          data-tip={`Adivinada por ${guesserName || 'Usuario'}`}
        >
          {renderAvatar()}
        </div>
      )}
    </div>
  );
};
