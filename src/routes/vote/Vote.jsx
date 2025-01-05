import { useState, useEffect } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { useConfetti } from '../../shared/hooks/useConfetti';
import { useVoteSystem } from './hooks/useVoteSystem';
import { TeamList } from './components/TeamList';
import { VoteForm } from './components/VoteForm';
import { LoginPrompt } from './components/LoginPrompt';
import { VoteCounter } from './components/VoteCounter';

const Vote = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { currentUser, signInWithGoogle } = useAuth();
  const { launchConfetti } = useConfetti();
  const { voterProfiles, hasVoted, currentVote, loading, registerVote, removeVote } = useVoteSystem(currentUser);

  useEffect(() => {
    if (currentVote) {
      setSelectedOption(currentVote);
    }
  }, [currentVote]);

  const handleVoteClick = (option) => {
    if (option === selectedOption) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
  };

  const handleConfirmVote = async () => {
    if (!currentUser) return;

    try {
      if (selectedOption === null && hasVoted) {
        // Remover voto
        await removeVote();
      } else if (selectedOption) {
        // Registrar nuevo voto
        await registerVote(selectedOption);
        launchConfetti(selectedOption);
      }
    } catch (error) {
      console.error('Error al gestionar el voto:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">¡Hora de Votar!</h1>
        
        <VoteCounter
          girlVotes={voterProfiles.girl.length}
          boyVotes={voterProfiles.boy.length}
        />

        <div className="grid grid-cols-3 gap-4">
          {/* Team Niña */}
          <TeamList
            team="Niña"
            voters={voterProfiles.girl}
            teamColor="pink"
          />

          {/* Área de Votación */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center gap-6">
              {!currentUser ? (
                <LoginPrompt onLogin={signInWithGoogle} />
              ) : (
                <VoteForm
                  selectedOption={selectedOption}
                  currentVote={currentVote}
                  hasVoted={hasVoted}
                  onVoteSelect={handleVoteClick}
                  onConfirmVote={handleConfirmVote}
                />
              )}
            </div>
          </div>

          {/* Team Niño */}
          <TeamList
            team="Niño"
            voters={voterProfiles.boy}
            teamColor="blue"
          />
        </div>
      </div>
    </div>
  );
};

export default Vote;
