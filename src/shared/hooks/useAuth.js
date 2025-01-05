import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

export function useAuth() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
         if (firebaseUser) {
            try {
               // Obtener datos adicionales del usuario desde Firestore
               const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
               const userData = userDoc.data();
               
               setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: firebaseUser.displayName,
                  role: userData?.role || 'invitado',
                  ...userData
               });
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

   return { user, loading };
}
