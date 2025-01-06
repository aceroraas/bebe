export const TeamSelector = ({ selectedOption, onVoteSelect, disabled = false }) => {
  const teams = [
    {
      id: 'girl',
      name: 'Team Niña',
      description: '¡Será una princesa!',
      icon: '👸',
      color: 'pink'
    },
    {
      id: 'boy',
      name: 'Team Niño',
      description: '¡Será un campeón!',
      icon: '👶',
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        ¿Qué Team Serás?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => !disabled && onVoteSelect(team.id)}
            disabled={disabled}
            className={`group relative overflow-hidden rounded-xl p-6 transition-all ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${
              selectedOption === team.id
                ? team.color === 'pink'
                  ? 'bg-pink-100 ring-2 ring-pink-500'
                  : 'bg-blue-100 ring-2 ring-blue-500'
                : team.color === 'pink'
                ? 'hover:bg-pink-100 bg-pink-50'
                : 'hover:bg-blue-100 bg-blue-50'
            }`}
          >
            <div className="relative z-10">
              <div className={`text-4xl mb-4 transform transition-transform group-hover:scale-125 ${
                team.color === 'pink' ? 'text-pink-500' : 'text-blue-500'
              }`}>
                {team.icon}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                team.color === 'pink' ? 'text-pink-700' : 'text-blue-700'
              }`}>
                {team.name}
              </h3>
              <p className={`text-sm ${
                team.color === 'pink' ? 'text-pink-600' : 'text-blue-600'
              }`}>
                {team.description}
              </p>
            </div>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${
              team.color === 'pink' ? 'bg-pink-500' : 'bg-blue-500'
            }`} />
          </button>
        ))}
      </div>

      {!disabled && (
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Selecciona un equipo para registrar tu predicción
          </p>
        </div>
      )}
    </div>
  );
};
