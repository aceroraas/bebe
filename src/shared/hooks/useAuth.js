import { useState, useEffect } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

export function useAuth() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   const updateUserData = async (firebaseUser) => {
      try {
         const userRef = doc(db, 'users', firebaseUser.uid);
         const userDoc = await getDoc(userRef);
         const existingData = userDoc.exists() ? userDoc.data() : {};

         // Si el usuario ya existe, solo actualizamos los campos básicos
         const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: existingData.role || 'invitado', // Preservar rol existente o usar 'invitado' como default
            updatedAt: new Date()
         };

         await setDoc(userRef, userData, { merge: true });
         return { ...userData, ...existingData };
      } catch (error) {
         console.error('Error updating user data:', error);
         throw error;
      }
   };

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
         if (firebaseUser) {
            try {
               const userData = await updateUserData(firebaseUser);
               setUser(userData);
            } catch (error) {
               console.error('Error fetching user data:', error);
               setUser(null);
            }
         } else {
            setUser(null);
         }
         setLoading(false);
      });

      return () => unsubscribe();
   }, []);

   const signInWithGoogle = async () => {
      try {
         const provider = new GoogleAuthProvider();
         const result = await signInWithPopup(auth, provider);
         return result.user;
      } catch (error) {
         console.error('Error signing in with Google:', error);
         throw error;
      }
   };

   return { 
      currentUser: user, 
      loading,
      signInWithGoogle 
   };
}
