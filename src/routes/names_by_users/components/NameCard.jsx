import React, { useState } from 'react';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const NameCard = ({ user, name, currentUserId, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  // Determinar el color del equipo basado en el voto del usuario
  const getTeamColor = () => {
    if (!user.vote) return 'bg-white hover:bg-gray-50';
    return user.vote === 'niño' 
      ? 'bg-blue-400 hover:bg-blue-500 text-white' 
      : 'bg-pink-400 hover:bg-pink-500 text-white';
  };

  const getAvatarColor = () => {
    if (!user.vote) return 'bg-primary';
    return user.vote === 'niño' 
      ? 'bg-blue-600' 
      : 'bg-pink-600';
  };

  const getTooltipColor = () => {
    if (!user.vote) return '';
    return user.vote === 'niño' 
      ? 'data-tip-blue' 
      : 'data-tip-pink';
  };

  const isOwnName = currentUserId === user.id;
  const displayName = capitalizeFirstLetter(name);

  const AvatarImage = () => {
    if (!user.photoURL || imageError) {
      return (
        <div 
          className={`w-16 h-16 rounded-full ${getAvatarColor()} flex items-center justify-center mb-2 text-white text-lg font-medium border-2 border-white shadow-inner`}
          title={user.displayName}
        >
          {getInitials(user.displayName)}
        </div>
      );
    }

    return (
      <img
        src={user.photoURL}
        alt={user.displayName}
        onError={() => setImageError(true)}
        className="w-16 h-16 rounded-full mb-2 border-2 border-white object-cover"
        loading="lazy"
      />
    );
  };

  return (
    <div 
      className={`animate-float w-32 h-32 p-4 ${getTeamColor()} rounded-lg shadow-lg 
        flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 relative group`}
    >
      <style jsx>{`
        .data-tip-blue::before {
          background-color: rgb(96 165 250) !important;
        }
        .data-tip-pink::before {
          background-color: rgb(244 114 182) !important;
        }
        .data-tip-blue::after {
          border-top-color: rgb(96 165 250) !important;
        }
        .data-tip-pink::after {
          border-top-color: rgb(244 114 182) !important;
        }
      `}</style>

      {isOwnName && (
        <button
          onClick={() => onDelete?.(name)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white opacity-0 
            group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center 
            hover:bg-red-600 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      <div className={`tooltip ${getTooltipColor()}`} data-tip={user.displayName || 'Usuario'}>
        <AvatarImage />
      </div>
      <span className="text-sm font-medium text-center truncate w-full">
        {displayName}
      </span>
    </div>
  );
};
