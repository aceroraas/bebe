import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export function useUserRoles(userId) {
   const [roles, setRoles] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchRoles = async () => {
         if (!userId) {
            setRoles([]);
            setLoading(false);
            return;
         }

         try {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
               const userData = userDoc.data();
               const userRole = userData.role;
               const userRoles = userRole ? [userRole] : [];
               setRoles(userRoles);
            } else {
               setRoles([]);
            }
         } catch (error) {
            setRoles([]);
         } finally {
            setLoading(false);
         }
      };

      fetchRoles();
   }, [userId]);

   return { roles, loading };
}
