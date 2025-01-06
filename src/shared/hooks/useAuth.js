import { useState, useEffect } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

export function useAuth() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   const updateUserData = async (firebaseUser) => {
      if (!firebaseUser) return null;

      try {
         const userRef = doc(db, 'users', firebaseUser.uid);
         const userDoc = await getDoc(userRef);

         // Datos básicos del usuario que siempre queremos mantener actualizados
         const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            lastLogin: new Date(),
            updatedAt: new Date()
         };

         if (userDoc.exists()) {
            // Si el usuario existe, preservamos los datos existentes y actualizamos
            const existingData = userDoc.data();
            await setDoc(userRef, {
               ...userData,
               role: existingData.role || 'invitado',
            }, { merge: true });
            return { ...userData, role: existingData.role || 'invitado' };
         } else {
            // Si es un usuario nuevo, lo creamos con rol 'invitado'
            const newUserData = {
               ...userData,
               role: 'invitado',
               createdAt: new Date()
            };
            await setDoc(userRef, newUserData);
            return newUserData;
         }
      } catch (error) {
         console.error('Error updating user data:', error);
         // En caso de error, retornamos los datos básicos del usuario
         return {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'invitado'
         };
      }
   };

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
         try {
            if (firebaseUser) {
               const userData = await updateUserData(firebaseUser);
               setUser(userData);
            } else {
               setUser(null);
            }
         } catch (error) {
            console.error('Auth state change error:', error);
            setUser(null);
         } finally {
            setLoading(false);
         }
      });

      return () => unsubscribe();
   }, []);

   const signInWithGoogle = async () => {
      try {
         const provider = new GoogleAuthProvider();
         const result = await signInWithPopup(auth, provider);
         const userData = await updateUserData(result.user);
         setUser(userData);
         return userData;
      } catch (error) {
         console.error('Google sign in error:', error);
         throw error;
      }
   };

   const signOut = async () => {
      try {
         await firebaseSignOut(auth);
         setUser(null);
      } catch (error) {
         console.error('Sign out error:', error);
         throw error;
      }
   };

   return {
      user,
      currentUser: user, // Para mantener compatibilidad con el código existente
      loading,
      signInWithGoogle,
      signOut
   };
}
