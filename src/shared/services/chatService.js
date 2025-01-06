import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const CHAT_COLLECTION = 'baby_chat';

/**
 * Envía un mensaje al chat
 * @param {string} sender - 'baby', 'mama', o 'papa'
 * @param {string} message - Contenido del mensaje
 * @param {string} userId - ID del usuario que envía el mensaje
 * @returns {Promise<string>}
 */
export const sendMessage = async (sender, message, userId) => {
   try {
      const chatCollection = collection(db, CHAT_COLLECTION);
      
      const messageData = {
         sender,
         message,
         userId,
         timestamp: serverTimestamp(),
      };
      
      const docRef = await addDoc(chatCollection, messageData);
      return docRef.id;
   } catch (error) {
      throw error;
   }
};

/**
 * Suscribe a los cambios en el chat
 * @param {Function} callback - Función que se llama con los nuevos mensajes
 * @returns {Function} Función para desuscribirse
 */
export const subscribeToChat = (callback) => {
   try {
      const chatCollection = collection(db, CHAT_COLLECTION);
      const q = query(chatCollection, orderBy('timestamp', 'asc'));
      
      return onSnapshot(q, (snapshot) => {
         const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
         }));
         callback(messages);
      }, (error) => {
         return () => {}; // Return empty cleanup function
      });
   } catch (error) {
      return () => {}; // Return empty cleanup function
   }
};
