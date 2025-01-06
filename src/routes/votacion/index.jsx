import React from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { useConfetti } from '../../shared/hooks/useConfetti';
import { useVoteSystem } from './hooks/useVoteSystem';
import { TeamSelector } from './components/TeamSelector';
import { VoteCounter } from './components/VoteCounter';
import { TeamList } from './components/TeamList';
import { useConfig } from '../../shared/services/getConfig';
import { isRevelationDay } from '../../shared/utils/dateUtils';
import { LoginPrompt } from './components/LoginPrompt';
import { CallToAction } from '../../shared/components/CallToAction';

export default function Vote() {
  const { currentUser, signInWithGoogle } = useAuth();
  const { launchConfetti } = useConfetti();
  const {
    currentVote,
    hasVoted,
    voterProfiles,
    loading: voteLoading,
    registerVote,
    removeVote
  } = useVoteSystem(currentUser);
  const { config, loading: configLoading } = useConfig();

  if (voteLoading || configLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center">
              <span className="loading loading-spinner loading-lg"></span>
              <p>Cargando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const metadata = config?.find(conf => conf.item === 'metadata')?.data;
  const isRevealDay = metadata?.revelationDay && isRevelationDay(metadata.revelationDay);

  const handleVoteSelect = async (option) => {
    if (!currentUser) return;
    if (isRevealDay && hasVoted) return;

    const voteValue = option === 'girl' ? 'niña' : 'niño';

    try {
      if (currentVote === voteValue && !isRevealDay) {
        await removeVote();
      } else {
        await registerVote(voteValue);
        launchConfetti({ type: option });
      }
    } catch (error) {
      console.error('Error al gestionar el voto:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <LoginPrompt onLogin={signInWithGoogle} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8">¡Hora de Elegir!</h1>

        <VoteCounter
          girlVotes={voterProfiles.girl.length}
          boyVotes={voterProfiles.boy.length}
        />

        {/* Call to Action para Nombres cuando ya ha votado */}
        {hasVoted && (
          <div className="mb-8">
            <CallToAction
              title="¡Ahora ponle nombre!"
              description="Ya elegiste tu team, ¿qué nombre crees que le quedaría mejor al bebé?"
              buttonText="Sugerir Nombres"
              route="/nombres"
              icon="👶"
              theme="secondary"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Niña */}
          <TeamList
            team="Niña"
            voters={voterProfiles.girl}
            teamColor="pink"
          />

          {/* Área de Votación */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <TeamSelector
                selectedOption={currentVote === 'niña' ? 'girl' : currentVote === 'niño' ? 'boy' : null}
                onVoteSelect={handleVoteSelect}
                disabled={isRevealDay && hasVoted}
              />

              {isRevealDay && hasVoted && (
                <div className="alert alert-info mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>¡Hoy es el día de la revelación! Ya no puedes cambiar tu voto.</span>
                </div>
              )}

              {isRevealDay && !hasVoted && (
                <div className="alert alert-warning mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <span>¡Hoy es el día de la revelación! Esta será tu última oportunidad para votar.</span>
                </div>
              )}

              {currentVote && !isRevealDay && (
                <div className="alert alert-success mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>¡Tu predicción ha sido registrada! Puedes cambiarla en cualquier momento antes del día de la revelación.</span>
                </div>
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
}
