import { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, doc, getDoc, updateDoc, getDocs, setDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebaseConfig';
import { setupAuthListener } from '../../shared/services/authService';
import LoginScreen from './components/LoginScreen';
import ConfigSection from './components/ConfigSection';
import UserManagement from './components/UserManagement';
import Revelacion from './components/Revelacion';
import BabyForm from './components/BabyForm';

export default function Config() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [configData, setConfigData] = useState({
      metadata: null,
      baby: null
   });
   const [userRole, setUserRole] = useState(null);

   useEffect(() => {
      const unsubscribe = setupAuthListener(async (userWithRole) => {
         if (userWithRole) {
            try {
               const usersCollectionRef = collection(db, 'users');
               const usersSnapshot = await getDocs(usersCollectionRef);

               // Si la colección está vacía, crear el primer usuario admin
               if (usersSnapshot.empty) {
                  console.log('Creando primer usuario admin...');
                  await setDoc(doc(usersCollectionRef, userWithRole.uid), {
                     email: userWithRole.email,
                     name: userWithRole.displayName,
                     photoURL: userWithRole.photoURL,
                     createdAt: new Date(),
                     role: 'admin'
                  });
                  console.log('Usuario admin creado exitosamente');
                  setUser(userWithRole);
                  setUserRole('admin');
                  loadConfigData();
                  return;
               }

               // Verificar permisos basados en el rol
               const role = userWithRole.role;

               if (role === 'admin' || role === 'revelador') {
                  setUser(userWithRole);
                  setUserRole(role);
                  if (role === 'admin') {
                     loadConfigData();
                  }
               } else {
                  console.log('Usuario sin permisos suficientes');
                  setError('No tienes permisos para ver esta página');
                  auth.signOut();
               }
            } catch (err) {
               console.error('Error al verificar usuario:', err);
               setError(`Error al verificar permisos: ${err.message}`);
               auth.signOut();
            }
         } else {
            console.log('No hay usuario autenticado');
            setUser(null);
            setError(null);
         }
         setLoading(false);
      });

      return () => unsubscribe();
   }, []);

   const handleGoogleLogin = async () => {
      try {
         const provider = new GoogleAuthProvider();
         await signInWithPopup(auth, provider);
      } catch (err) {
         console.error('Error al iniciar sesión con Google:', err);
         setError('Error al iniciar sesión con Google');
      }
   };

   const loadConfigData = async () => {
      try {
         const configs = ['metadata', 'baby'];
         const data = {};

         for (const configName of configs) {
            const docRef = doc(collection(db, 'configuracion'), configName);
            const docSnap = await getDoc(docRef);
            if (configName === 'baby') {
               data[configName] = docSnap.data() || { sex: { male: {}, female: {} } };
            } else {
               data[configName] = docSnap.data();
            }
         }

         setConfigData(data);
      } catch (err) {
         console.error('Error loading config data:', err);
         setError('Error al cargar la configuración');
      }
   };

   const updateConfig = async (configName, newData) => {
      try {
         const docRef = doc(collection(db, 'configuracion'), configName);
         await updateDoc(docRef, newData);
         await loadConfigData();
      } catch (err) {
         console.error('Error updating config:', err);
         setError('Error al actualizar la configuración');
      }
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
         </div>
      );
   }

   if (!user) {
      return <LoginScreen onGoogleLogin={handleGoogleLogin} />;
   }

   if (error) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="alert alert-error">
               <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span>{error}</span>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto p-4">
         <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <h1 className="text-2xl font-bold">Panel de Configuración</h1>
               <div className="badge badge-primary">{userRole === 'admin' ? 'Administrador' : 'Revelador'}</div>
            </div>
            <button onClick={() => auth.signOut()} className="btn btn-ghost">
               Cerrar Sesión
            </button>
         </div>

         <div className="grid gap-6">
            {userRole === 'admin' && (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                           <h2 className="card-title">Metadatos</h2>
                           <ConfigSection
                              title="Metadatos"
                              data={configData.metadata}
                              onUpdate={(newData) => updateConfig('metadata', newData)}
                           />
                        </div>
                     </div>
                     <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                           <h2 className="card-title">Datos del Bebé</h2>
                           <BabyForm
                              data={configData.baby}
                              onUpdate={(newData) => updateConfig('baby', newData)}
                           />
                        </div>
                     </div>
                  </div>
                  <div className="card bg-base-100 shadow-xl">
                     <div className="card-body">
                        <h2 className="card-title">Gestión de Usuarios</h2>
                        <UserManagement />
                     </div>
                  </div>
               </>
            )}
            
            {(userRole === 'admin' || userRole === 'revelador') && (
               <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                     <h2 className="card-title">Revelación</h2>
                     <Revelacion
                        data={configData.baby}
                        onUpdate={(newData) => updateConfig('baby', newData)}
                     />
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}