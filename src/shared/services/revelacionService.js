import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const CONFIG_COLLECTION = 'configuracion';
const REVELACION_DOC_ID = 'revelacion';

export const GENDER_CONTENT = {
   boy: {
      title: "¡Es un Príncipe!",
      description: "¡Bienvenido al mundo pequeño príncipe! Una nueva aventura está por comenzar.",
      emoji: "👑👶",
      color: "text-blue-500",
      alert: "alert-primary",
      message: "Un nuevo príncipe está en camino para llenar nuestras vidas de alegría y aventuras."
   },
   girl: {
      title: "¡Es una Princesa!",
      description: "¡Bienvenida al mundo pequeña princesa! Una nueva aventura está por comenzar.",
      emoji: "👸👶",
      color: "text-pink-500",
      alert: "alert-secondary",
      message: "Una nueva princesa está en camino para llenar nuestras vidas de magia y dulzura."
   },
   none: {
      title: "No Revelado",
      description: "El género aún no ha sido configurado",
      emoji: "👶",
      color: "text-gray-500",
      alert: "alert-info",
      message: "Esperando la configuración del género..."
   }
};

/**
 * Obtiene el género revelado y su contenido asociado
 * @returns {Promise<{gender: string, content: object}>} 
 */
export async function getRevelacionData() {
  const docRef = doc(db, CONFIG_COLLECTION, REVELACION_DOC_ID);
  
  try {
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const gender = data?.gender || 'none';
      return {
        gender,
        content: GENDER_CONTENT[gender],
        updatedAt: data.updatedAt
      };
    } else {
      // Si no existe el documento, lo creamos con valores por defecto
      const defaultData = {
        gender: 'none',
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, defaultData);
      return {
        gender: 'none',
        content: GENDER_CONTENT.none,
        updatedAt: new Date().toISOString()
      };
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Actualiza el género revelado y devuelve el género y contenido actualizados
 * @param {string} gender - 'none', 'boy', o 'girl'
 * @returns {Promise<{gender: string, content: object}>} 
 */
export async function updateRevelacion(gender) {
  if (!['none', 'boy', 'girl'].includes(gender)) {
    throw new Error('Valor de género inválido');
  }

  try {
    const docRef = doc(db, CONFIG_COLLECTION, REVELACION_DOC_ID);
    
    await setDoc(docRef, {
      gender,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return {
      gender,
      content: GENDER_CONTENT[gender],
      updatedAt: new Date().toISOString()
    };
  } catch (err) {
    throw err;
  }
};

/**
 * Obtiene los usuarios que votaron correctamente
 * @param {string} revealedGender - Género revelado
 * @returns {Promise<Array<{id: string, displayName: string, photoURL: string}>>} 
 */
export async function getCorrectVoters(revealedGender) {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const correctVoters = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.vote === 'niño' && revealedGender === 'boy' ||
          userData.vote === 'niña' && revealedGender === 'girl') {
        correctVoters.push({
          id: doc.id,
          displayName: userData.displayName,
          photoURL: userData.photoURL
        });
      }
    });

    return correctVoters;
  } catch (error) {
    throw error;
  }
};
