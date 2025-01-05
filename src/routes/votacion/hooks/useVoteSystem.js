import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '../../../shared/services/firebaseConfig';

export const useVoteSystem = (currentUser) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVote, setCurrentVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voterProfiles, setVoterProfiles] = useState({ girl: [], boy: [] });

  // Limpiar estado cuando no hay usuario
  useEffect(() => {
    if (!currentUser) {
      setCurrentVote(null);
      setHasVoted(false);
      setVoterProfiles({ girl: [], boy: [] });
      setLoading(false);
      return;
    }
  }, [currentUser]);

  // Escuchar el voto del usuario actual
  useEffect(() => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const unsubscribeUser = onSnapshot(userRef, 
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setCurrentVote(userData.vote || null);
            setHasVoted(!!userData.vote);
          } else {
            setCurrentVote(null);
            setHasVoted(false);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error listening to user:', error);
          setError(error);
          setLoading(false);
        }
      );

      return () => unsubscribeUser();
    } catch (error) {
      console.error('Error setting up user listener:', error);
      setError(error);
      setLoading(false);
    }
  }, [currentUser]);

  // Escuchar todos los usuarios para obtener votos
  useEffect(() => {
    if (!currentUser) return;

    try {
      const usersQuery = query(collection(db, 'users'));
      const unsubscribeUsers = onSnapshot(
        usersQuery,
        (snapshot) => {
          try {
            const girlVoters = [];
            const boyVoters = [];

            snapshot.forEach((doc) => {
              const userData = doc.data();
              if (!userData.vote) return; // Ignorar usuarios sin voto

              const voterProfile = {
                userId: doc.id,
                userEmail: userData.email,
                userName: userData.displayName || userData.name,
                userPhoto: userData.photoURL || userData.photoUrl || null,
                timestamp: userData.voteTimestamp || userData.updatedAt || new Date()
              };

              if (userData.vote === 'niña') {
                girlVoters.push(voterProfile);
              } else if (userData.vote === 'niño') {
                boyVoters.push(voterProfile);
              }
            });

            // Ordenar por timestamp
            const sortByTimestamp = (a, b) => 
              (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);

            setVoterProfiles({
              girl: girlVoters.sort(sortByTimestamp),
              boy: boyVoters.sort(sortByTimestamp)
            });
          } catch (error) {
            console.error('Error processing users:', error);
            setError(error);
          }
        },
        (error) => {
          console.error('Error listening to users:', error);
          setError(error);
        }
      );

      return () => unsubscribeUsers();
    } catch (error) {
      console.error('Error setting up users listener:', error);
      setError(error);
    }
  }, [currentUser]);

  const registerVote = async (vote) => {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userDoc.data();
      await setDoc(userRef, {
        ...userData,
        vote,
        voteTimestamp: new Date(),
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error al registrar el voto:', error);
      setError(error);
      throw error;
    }
  };

  const removeVote = async () => {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userDoc.data();
      const { vote, voteTimestamp, ...restData } = userData; // Eliminar vote y voteTimestamp
      await setDoc(userRef, {
        ...restData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error al eliminar el voto:', error);
      setError(error);
      throw error;
    }
  };

  return {
    currentVote,
    hasVoted,
    voterProfiles,
    loading,
    error,
    registerVote,
    removeVote
  };
};
