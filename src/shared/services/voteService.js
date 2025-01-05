import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const USERS_COLLECTION = 'users';

/**
 * Obtiene todos los votos agrupados por opción
 * @returns {Promise<{girl: Array, boy: Array}>}
 */
export const getVotes = async () => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const girlVotesQuery = query(usersRef, where('vote', '==', 'girl'));
    const boyVotesQuery = query(usersRef, where('vote', '==', 'boy'));

    const [girlVotes, boyVotes] = await Promise.all([
      getDocs(girlVotesQuery),
      getDocs(boyVotesQuery)
    ]);

    return {
      girl: girlVotes.docs.map(doc => doc.data()),
      boy: boyVotes.docs.map(doc => doc.data())
    };
  } catch (error) {
    console.error('Error fetching votes:', error);
    throw new Error('No se pudieron cargar los votos');
  }
};

/**
 * Verifica si un usuario ya ha votado
 * @param {string} userId - ID del usuario
 * @returns {Promise<{hasVoted: boolean, currentVote: string|null}>}
 */
export const hasUserVoted = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    const userData = userDoc.exists() ? userDoc.data() : null;
    return {
      hasVoted: userData?.vote !== undefined,
      currentVote: userData?.vote || null
    };
  } catch (error) {
    console.error('Error checking user vote:', error);
    throw new Error('No se pudo verificar el voto del usuario');
  }
};

/**
 * Registra o remueve el voto de un usuario
 * @param {Object} user - Objeto con la información del usuario
 * @param {string|null} vote - Opción votada ('boy' o 'girl'), o null para remover el voto
 * @returns {Promise<void>}
 */
export const registerUserVote = async (user, vote) => {
  if (!user?.uid) {
    throw new Error('Usuario no válido');
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userRef);
    const existingData = userDoc.exists() ? userDoc.data() : {};

    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: existingData.role || 'guest',
      updatedAt: new Date()
    };

    // Si vote es null, eliminamos el campo vote
    if (vote !== null) {
      userData.vote = vote;
    }

    await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error('Error registering vote:', error);
    throw new Error('No se pudo registrar el voto');
  }
};

/**
 * Remueve el voto de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<void>}
 */
export const removeVote = async (userId) => {
  if (!userId) {
    throw new Error('Usuario no válido');
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userDoc.data();
    const { vote, ...userDataWithoutVote } = userData;

    await setDoc(userRef, {
      ...userDataWithoutVote,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error removing vote:', error);
    throw new Error('No se pudo remover el voto');
  }
};
