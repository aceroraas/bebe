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
      console.log('Sending message:', { sender, message, userId });
      const chatCollection = collection(db, CHAT_COLLECTION);
      
      const messageData = {
         sender,
         message,
         userId,
         timestamp: serverTimestamp(),
      };
      
      console.log('Message data:', messageData);
      const docRef = await addDoc(chatCollection, messageData);
      console.log('Message sent successfully:', docRef.id);
      return docRef.id;
   } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', {
         code: error.code,
         message: error.message
      });
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
         console.error('Error in chat subscription:', error);
      });
   } catch (error) {
      console.error('Error setting up chat subscription:', error);
      return () => {}; // Return empty cleanup function
   }
};
