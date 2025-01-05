import { doc, getDoc, setDoc } from 'firebase/firestore';
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
   try {
      console.log('Obteniendo datos de revelación...');
      const docRef = doc(db, CONFIG_COLLECTION, REVELACION_DOC_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
         const data = docSnap.data();
         console.log('Datos de revelación encontrados:', data);
         const gender = data.gender || 'none';
         console.log('Género en el documento:', gender);
         
         return {
            gender,
            content: GENDER_CONTENT[gender],
            updatedAt: data.updatedAt
         };
      }

      console.log('No se encontró documento de revelación, creando uno nuevo...');
      // Si no existe el documento, crearlo con valor por defecto
      await setDoc(docRef, {
         gender: 'none',
         updatedAt: new Date().toISOString()
      });

      return {
         gender: 'none',
         content: GENDER_CONTENT.none,
         updatedAt: new Date().toISOString()
      };
   } catch (err) {
      console.error('Error al obtener datos de revelación:', err);
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
      console.log('Actualizando género a:', gender);
      const docRef = doc(db, CONFIG_COLLECTION, REVELACION_DOC_ID);
      
      await setDoc(docRef, {
         gender,
         updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log('Género actualizado exitosamente');
      return {
         gender,
         content: GENDER_CONTENT[gender],
         updatedAt: new Date().toISOString()
      };
   } catch (err) {
      console.error('Error al actualizar revelación:', err);
      throw err;
   }
};
