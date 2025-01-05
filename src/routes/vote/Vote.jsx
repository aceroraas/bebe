import { useState } from 'react';
import { useConfetti } from '../../shared/hooks/useConfetti';

const Vote = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const [voterProfiles, setVoterProfiles] = useState({
    girl: [],
    boy: []
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const { launchConfetti } = useConfetti();

  // Simulated user data (as if authenticated with Google)
  const currentUser = {
    name: "Usuario Ejemplo",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  };

  const handleVoteClick = (option) => {
    setSelectedOption(option);
  };

  const confirmVote = () => {
    if (!selectedOption || hasVoted) return;

    setVoterProfiles(prev => ({
      ...prev,
      [selectedOption]: [...prev[selectedOption], currentUser]
    }));
    setHasVoted(true);
    launchConfetti(selectedOption); // Pasamos 'boy' o 'girl' según la selección
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">¡Hora de Votar!</h1>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Columna Izquierda - Votos Niña */}
          <div className="bg-pink-100 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-pink-600 text-center mb-4">Votaron Niña</h2>
            <div className="flex flex-col gap-2">
              {voterProfiles.girl.map((voter, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-2 rounded">
                  <img src={voter.image} alt={voter.name} className="w-8 h-8 rounded-full" />
                  <span className="text-sm">{voter.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Central - Área de Votación */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center gap-6">
              {!hasVoted ? (
                <>
                  <h3 className="text-lg text-gray-700 text-center mb-4">
                    Selecciona tu voto:
                  </h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVoteClick('girl')}
                      className={`px-6 py-3 rounded-lg text-white font-bold ${
                        selectedOption === 'girl'
                          ? 'bg-pink-500 ring-4 ring-pink-300'
                          : 'bg-pink-400 hover:bg-pink-500'
                      } transition-all`}
                    >
                      NIÑA
                    </button>
                    <button
                      onClick={() => handleVoteClick('boy')}
                      className={`px-6 py-3 rounded-lg text-white font-bold ${
                        selectedOption === 'boy'
                          ? 'bg-blue-500 ring-4 ring-blue-300'
                          : 'bg-blue-400 hover:bg-blue-500'
                      } transition-all`}
                    >
                      NIÑO
                    </button>
                  </div>
                  {selectedOption && (
                    <div className="text-center">
                      <p className="text-gray-600 mb-3">
                        ¿Confirmas tu voto por {selectedOption === 'boy' ? 'NIÑO' : 'NIÑA'}?
                      </p>
                      <button
                        onClick={confirmVote}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                      >
                        Confirmar Voto
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-700">¡Gracias por votar!</h3>
                  <p className="text-gray-500">Tu voto ha sido registrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha - Votos Niño */}
          <div className="bg-blue-100 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">Votaron Niño</h2>
            <div className="flex flex-col gap-2">
              {voterProfiles.boy.map((voter, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-2 rounded">
                  <img src={voter.image} alt={voter.name} className="w-8 h-8 rounded-full" />
                  <span className="text-sm">{voter.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;
