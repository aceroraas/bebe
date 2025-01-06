import { doc, getDoc, updateDoc, onSnapshot, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Obtiene la información del bebé según el género revelado
export const getBabyInfo = async (gender) => {
  try {
    const docRef = doc(db, 'configuracion', 'baby');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return gender === 'boy' ? data.sex.male : data.sex.female;
    }
    return null;
  } catch (error) {
    console.error('Error getting baby info:', error);
    throw error;
  }
};

// Suscribe a cambios en las letras adivinadas y usuarios
export const subscribeToGameState = (callback) => {
  // Suscribirse a las letras adivinadas
  const lettersRef = doc(db, 'configuracion', 'guessed_letters');
  const lettersUnsubscribe = onSnapshot(lettersRef, async (doc) => {
    const letters = doc.exists() ? doc.data() : { first_name: {}, second_name: {} };

    // Obtener información de usuarios que han adivinado
    const usersRef = collection(db, 'users');
    const usersSnap = await getDocs(usersRef);
    const users = {};

    usersSnap.forEach((userDoc) => {
      const userData = userDoc.data();
      users[userDoc.id] = {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        isAdmin: userData.isAdmin,
        correctGuesses: userData.correctGuesses || []
      };
    });

    callback({ letters, users });
  });

  return lettersUnsubscribe;
};

// Intenta adivinar una letra
export const guessLetter = async (letter, nameType, userId, position) => {
  try {
    // Primero verificamos si la letra está en la posición correcta
    const babyInfoDoc = await getDoc(doc(db, 'configuracion', 'baby'));
    if (!babyInfoDoc.exists()) {
      throw new Error('No se encontró la información del bebé');
    }

    const babyInfo = babyInfoDoc.data();
    const name = babyInfo.sex.male || babyInfo.sex.female;
    const targetName = nameType === 'first_name' ? name.first_name : name.second_name;

    // Verificar si la letra coincide en la posición
    if (targetName[position]?.toUpperCase() !== letter.toUpperCase()) {
      throw new Error('La letra no coincide en esta posición');
    }

    const docRef = doc(db, 'configuracion', 'guessed_letters');
    const docSnap = await getDoc(docRef);
    const currentData = docSnap.exists() ? docSnap.data() : { first_name: {}, second_name: {} };

    // Si la letra no existe en este nombre, la agregamos con el usuario que la adivinó
    if (!currentData[nameType][letter]) {
      // Si el documento no existe, lo creamos con setDoc
      if (!docSnap.exists()) {
        await setDoc(docRef, currentData);
      }
      
      // Luego actualizamos el documento con la nueva letra
      await updateDoc(docRef, {
        [`${nameType}.${letter}`]: userId
      });

      // Actualizar el array de aciertos del usuario
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const correctGuesses = userData?.correctGuesses || [];

      if (!correctGuesses.includes(`${nameType}.${letter}`)) {
        await updateDoc(userRef, {
          correctGuesses: [...correctGuesses, `${nameType}.${letter}`]
        });
      }

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error guessing letter:', error);
    throw error;
  }
};

// Reinicia las letras adivinadas
export const resetGuessedLetters = async () => {
  try {
    const lettersRef = doc(db, 'configuracion', 'guessed_letters');
    await updateDoc(lettersRef, {
      first_name: {},
      second_name: {}
    });

    // Reiniciar los intentos de los usuarios no admin
    const usersRef = collection(db, 'users');
    const usersSnap = await getDocs(usersRef);

    const batch = db.batch();
    usersSnap.forEach((userDoc) => {
      const userData = userDoc.data();
      // Solo reiniciar intentos de usuarios no admin
      if (!userData.isAdmin) {
        batch.update(userDoc.ref, { correctGuesses: [] });
      }
    });

    await batch.commit();
  } catch (error) {
    console.error('Error resetting game:', error);
    throw error;
  }
};
