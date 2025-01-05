export const TeamList = ({ team, voters, teamColor }) => {
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevenir loop infinito
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  return (
    <div className={`bg-${teamColor}-50 p-6 rounded-lg shadow-lg`}>
      <h3 className={`text-xl font-bold mb-4 text-${teamColor}-700 text-center`}>
        Team {team}
      </h3>
      
      <div className="space-y-3">
        {voters.map((voter, index) => (
          <div
            key={voter.userEmail || index}
            className="flex items-center gap-3 bg-white p-2 rounded-lg shadow"
          >
            {voter.userPhoto ? (
              <>
                <img
                  src={voter.userPhoto}
                  alt={voter.userName}
                  className="w-8 h-8 rounded-full"
                  onError={handleImageError}
                />
                <div 
                  className={`w-8 h-8 rounded-full bg-${teamColor}-200 flex items-center justify-center hidden`}
                >
                  {voter.userName?.charAt(0)?.toUpperCase() || '?'}
                </div>
              </>
            ) : (
              <div className={`w-8 h-8 rounded-full bg-${teamColor}-200 flex items-center justify-center`}>
                {voter.userName?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <span className="text-sm font-medium truncate">
              {voter.userName || 'Anónimo'}
            </span>
          </div>
        ))}

        {voters.length === 0 && (
          <p className="text-center text-gray-500 text-sm italic">
            Aún no hay votos
          </p>
        )}
      </div>
    </div>
  );
};
