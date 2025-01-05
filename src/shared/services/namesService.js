import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs, arrayRemove } from 'firebase/firestore';
import { db } from './firebaseConfig';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const addNameToUser = async (userId, newName) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userDoc.data();
    const names = userData.names || [];
    const capitalizedName = capitalizeFirstLetter(newName.trim());

    // Verificar si el nombre ya existe (case insensitive)
    if (names.some(name => name.toLowerCase() === capitalizedName.toLowerCase())) {
      throw new Error('Ya has sugerido este nombre');
    }

    await updateDoc(userRef, {
      names: arrayUnion(capitalizedName)
    });

    return true;
  } catch (error) {
    console.error('Error adding name:', error);
    throw error;
  }
};

export const removeName = async (userId, nameToRemove) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      names: arrayRemove(nameToRemove)
    });
    return true;
  } catch (error) {
    console.error('Error removing name:', error);
    throw error;
  }
};

export const getAllUsersWithNames = async () => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.names && userData.names.length > 0) {
        users.push({
          id: doc.id,
          ...userData,
          currentVote: userData.vote
        });
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users with names:', error);
    throw error;
  }
};

export const getUserByName = async (userName) => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.displayName?.toLowerCase().includes(userName.toLowerCase())) {
        users.push({
          id: doc.id,
          ...userData,
          currentVote: userData.vote
        });
      }
    });

    return users;
  } catch (error) {
    console.error('Error searching user:', error);
    throw error;
  }
};
