import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export function useUserRoles(userId) {
   const [roles, setRoles] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchRoles = async () => {
         if (!userId) {
            console.log('No userId provided');
            setRoles([]);
            setLoading(false);
            return;
         }

         try {
            console.log('Fetching roles for userId:', userId);
            const userDocRef = doc(db, 'users', userId);
            console.log('Fetching document from:', userDocRef.path);
            
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
               const userData = userDoc.data();
               console.log('User data found:', userData);
               
               // Obtener el role y convertirlo en array si existe
               const userRole = userData.role;
               const userRoles = userRole ? [userRole] : [];
               console.log('User roles:', userRoles);
               
               setRoles(userRoles);
            } else {
               console.log('User document does not exist in "users" collection');
               setRoles([]);
            }
         } catch (error) {
            console.error('Error fetching user roles:', error);
            console.error('Error details:', {
               code: error.code,
               message: error.message,
               stack: error.stack
            });
            setRoles([]);
         } finally {
            setLoading(false);
         }
      };

      fetchRoles();
   }, [userId]);

   return { roles, loading };
}
