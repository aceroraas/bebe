import { auth } from '../../../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Maneja la actualización del usuario cuando inicia sesión
 * Si el correo está pre-autorizado, actualiza el documento con el UID y mantiene el rol
 */
export const handleUserAuth = async (firebaseUser) => {
    if (!firebaseUser) return null;

    try {
        // Primero verificar si el usuario ya existe
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        // Si el usuario ya existe, solo actualizar último login
        if (userDoc.exists()) {
            const userData = userDoc.data();
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...userData,
                lastLogin: new Date().toISOString()
            }, { merge: true });

            return {
                ...firebaseUser,
                role: userData.role
            };
        }

        // Si no existe, buscar si hay pre-autorización por email
        const emailId = firebaseUser.email.replace(/[.#$[\]]/g, '_');
        const preAuthDoc = await getDoc(doc(db, 'users', emailId));
        
        // Si existe un documento pre-autorizado
        if (preAuthDoc.exists()) {
            const preAuthData = preAuthDoc.data();
            
            // Crear nuevo documento con el UID
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...preAuthData,
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                lastLogin: new Date().toISOString(),
                preAuthorized: false // Ya no es pre-autorizado
            });

            // Eliminar el documento pre-autorizado
            await deleteDoc(doc(db, 'users', emailId));

            return {
                ...firebaseUser,
                role: preAuthData.role
            };
        }

        // Si no está pre-autorizado y no existe, verificar si es el primer usuario
        const usersSnapshot = await getDocs(collection(db, 'users'));
        if (usersSnapshot.empty) {
            // Si es el primer usuario, hacerlo admin
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: 'admin',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
            return {
                ...firebaseUser,
                role: 'admin'
            };
        }

        // Si no es ninguno de los casos anteriores, crear como invitado
        await setDoc(doc(db, 'users', firebaseUser.uid), {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'invitado',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });
        
        return {
            ...firebaseUser,
            role: 'invitado'
        };
    } catch (error) {
        console.error('Error handling user auth:', error);
        throw error; // Propagar el error para manejarlo en el componente
    }
};

/**
 * Hook personalizado para manejar la autenticación
 */
export const setupAuthListener = (callback) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            try {
                const userWithRole = await handleUserAuth(firebaseUser);
                callback(userWithRole);
            } catch (error) {
                console.error('Error in auth listener:', error);
                callback(null);
            }
        } else {
            callback(null);
        }
    });
};
