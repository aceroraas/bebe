import { useState, useEffect } from 'react';
import { getVotes, hasUserVoted, registerUserVote, removeVote as removeUserVote } from '../../../shared/services/voteService';

export const useVoteSystem = (currentUser) => {
  const [voterProfiles, setVoterProfiles] = useState({ girl: [], boy: [] });
  const [hasVoted, setHasVoted] = useState(false);
  const [currentVote, setCurrentVote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVotes();
    if (currentUser) {
      checkUserVote();
    }
  }, [currentUser]);

  const loadVotes = async () => {
    try {
      const votes = await getVotes();
      setVoterProfiles(votes);
    } catch (error) {
      console.error('Error loading votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserVote = async () => {
    if (!currentUser) return;

    try {
      const { hasVoted: voted, currentVote: vote } = await hasUserVoted(currentUser.uid);
      setHasVoted(voted);
      setCurrentVote(vote);
    } catch (error) {
      console.error('Error checking user vote:', error);
    }
  };

  const registerVote = async (vote) => {
    if (!currentUser) return;

    try {
      await registerUserVote(currentUser, vote);
      setHasVoted(true);
      setCurrentVote(vote);
      await loadVotes();
    } catch (error) {
      console.error('Error registering vote:', error);
      throw error;
    }
  };

  const removeVote = async () => {
    if (!currentUser) return;

    try {
      await removeUserVote(currentUser.uid);
      setHasVoted(false);
      setCurrentVote(null);
      await loadVotes();
    } catch (error) {
      console.error('Error removing vote:', error);
      throw error;
    }
  };

  return {
    voterProfiles,
    hasVoted,
    currentVote,
    loading,
    registerVote,
    removeVote
  };
};
