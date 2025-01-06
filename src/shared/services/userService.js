import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

/**
 * Roles disponibles en la aplicación
 */
export const AVAILABLE_ROLES = ['invitado', 'admin', 'revelador'];

/**
 * Valida que el email sea de gmail.com
 */
const isValidGmail = (email) => {
   const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
   return gmailRegex.test(email);
};

/**
 * Obtiene todos los usuarios de Firestore
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getUsers = async () => {
   try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({
         id: doc.id,
         ...doc.data()
      }));
   } catch (error) {
      console.error('Error getting users:', error);
      throw new Error('Error al obtener los usuarios');
   }
};

/**
 * Actualiza el rol de un usuario
 * @param {string} userId - ID del usuario
 * @param {string} newRole - Nuevo rol a asignar
 * @returns {Promise<void>}
 */
export const updateUserRole = async (userId, newRole) => {
   if (!AVAILABLE_ROLES.includes(newRole)) {
      throw new Error('Rol inválido');
   }

   try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { role: newRole }, { merge: true });
   } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error('Error al actualizar el rol del usuario');
   }
};

/**
 * Pre-autoriza un email con un rol específico
 */
export const preAuthorizeEmail = async (email, role = 'invitado') => {
   try {
      if (!AVAILABLE_ROLES.includes(role)) {
         throw new Error('Rol inválido');
      }

      if (!isValidGmail(email)) {
         return {
            success: false,
            error: 'Solo se permiten correos de gmail.com'
         };
      }

      // Generar un ID único para el usuario basado en el email
      const userId = email.replace(/[.#$[\]]/g, '_');
      const userRef = doc(db, 'users', userId);
      
      // Verificar si el usuario ya existe
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
         return { 
            success: false, 
            error: 'El email ya está registrado' 
         };
      }

      // Crear documento de pre-autorización
      await setDoc(userRef, {
         email,
         role,
         preAuthorized: true,
         createdAt: new Date().toISOString(),
         lastUpdated: new Date().toISOString()
      });

      return { 
         success: true, 
         user: { 
            id: userId, 
            email, 
            role,
            preAuthorized: true
         } 
      };
   } catch (error) {
      console.error('Error pre-authorizing email:', error);
      throw new Error('Error al pre-autorizar el email');
   }
};

/**
 * Verifica si un email está pre-autorizado y obtiene su rol
 */
export const getPreAuthorizedRole = async (email) => {
   try {
      if (!isValidGmail(email)) {
         return null;
      }

      const userId = email.replace(/[.#$[\]]/g, '_');
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists() && userDoc.data().preAuthorized) {
         return userDoc.data().role || 'invitado';
      }
      
      return null;
   } catch (error) {
      console.error('Error checking pre-authorization:', error);
      return null;
   }
};

/**
 * Registra un nuevo usuario con email
 * @param {string} email - Email del usuario
 * @param {string} name - Nombre del usuario
 * @param {string} initialRole - Rol inicial del usuario
 * @returns {Promise<Object>} Usuario creado
 */
export const registerNewUser = async (email, name, initialRole = 'invitado') => {
   try {
      // Generar un ID único para el usuario
      const userId = email.replace(/[.#$[\]]/g, '_');
      const userRef = doc(db, 'users', userId);
      
      // Verificar si el usuario ya existe
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
         return { 
            success: false, 
            error: 'El usuario ya existe' 
         };
      }

      // Verificar si el email está pre-autorizado
      const preAuthorizedRole = await getPreAuthorizedRole(email);
      if (preAuthorizedRole) {
         initialRole = preAuthorizedRole;
      }

      // Crear nuevo usuario en Firestore
      await setDoc(userRef, {
         email,
         name,
         role: initialRole,
         createdAt: new Date().toISOString()
      });

      return { 
         success: true, 
         user: { 
            id: userId, 
            email, 
            name, 
            role: initialRole 
         } 
      };
   } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Error al registrar el usuario');
   }
};
