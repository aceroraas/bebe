import { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, updateDoc, getDocs, setDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebaseConfig';

export default function Config() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [configData, setConfigData] = useState({
      metadata: null,
      mainPage: null,
      baby: null
   });
   const [userRole, setUserRole] = useState(null);

   useEffect(() => {

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         if (user) {
            try {
               const usersCollectionRef = collection(db, 'users');
               const usersSnapshot = await getDocs(usersCollectionRef);

               // Si la colección está vacía, crear el primer usuario admin
               if (usersSnapshot.empty) {
                  console.log('Creando primer usuario admin...');
                  await setDoc(doc(usersCollectionRef, user.uid), {
                     email: user.email,
                     name: user.displayName,
                     photoURL: user.photoURL,
                     createdAt: new Date(),
                     role: 'admin'
                  });
                  console.log('Usuario admin creado exitosamente');
                  setUser(user);
                  setUserRole('admin');
                  loadConfigData();
                  return;
               }

               // Si ya existen usuarios, verificar el rol del usuario actual
               const userDocRef = doc(db, 'users', user.uid);
               const userDoc = await getDoc(userDocRef);

               if (!userDoc.exists()) {
                  console.log('Usuario no existe, creando nuevo usuario sin rol...');
                  await setDoc(userDocRef, {
                     email: user.email,
                     name: user.displayName,
                     photoURL: user.photoURL,
                     createdAt: new Date()
                  });
               }

               const userData = userDoc.exists() ? userDoc.data() : null;
               const role = userData?.role;

               if (role === 'admin' || role === 'revelador') {
                  setUser(user);
                  setUserRole(role);
                  loadConfigData();
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
            setError(null); // Limpiamos el error para que no se muestre
         }
         setLoading(false);
      });

      return () => unsubscribe();
   }, []);

   const loadConfigData = async () => {
      try {
         const configs = ['metadata', 'mainPage', 'baby'];
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
         console.error('Error al cargar la configuración:', err);
         setError(`Error al cargar la configuración: ${err.message}`);
      }
   };

   const handleGoogleLogin = async () => {
      try {
         setError(null);
         const provider = new GoogleAuthProvider();
         await signInWithPopup(auth, provider);
      } catch (err) {
         console.error('Error al iniciar sesión con Google:', err);
         setError('Error al iniciar sesión con Google: ' + err.message);
      }
   };

   const handleLogout = async () => {

      await auth.signOut();
      setUser(null);
      setUserRole(null);
   };

   const updateConfig = async (configName, newData) => {
      try {
         const docRef = doc(collection(db, 'configuracion'), configName);
         await updateDoc(docRef, newData);
         await loadConfigData(); // Recargar datos

         // Actualizar el localStorage inmediatamente
         const cacheData = {
            data: configData,
            timestamp: Date.now()
         };
         localStorage.setItem('app_config', JSON.stringify(cacheData));
      } catch (err) {
         console.error('Error al actualizar la configuración:', err);
         setError(`Error al actualizar la configuración: ${err.message}`);
      }
   };

   if (loading) {
      return <div>Cargando...</div>;
   }

   if (!user) {
      return <LoginScreen onGoogleLogin={handleGoogleLogin} />;
   }

   if (error) {
      return (
         <div className="alert alert-error">
            <div>
               <span>{error}</span>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto p-4">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Configuraciones</h1>
            <div className="flex items-center gap-4">
               <div className="badge badge-primary">{userRole === 'admin' ? 'Administrador' : 'Revelador'}</div>
               <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Cerrar Sesión
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConfigSection
               title="Metadatos"
               data={configData.metadata}
               onUpdate={(newData) => updateConfig('metadata', newData)}
            />
            <ConfigSection
               title="Página Principal"
               data={configData.mainPage}
               onUpdate={(newData) => updateConfig('mainPage', newData)}
            />
            <ConfigSection
               title="Bebé"
               data={configData.baby}
               onUpdate={(newData) => updateConfig('baby', newData)}
            />
            {userRole === 'admin' && (
               <UserManagement />
            )}
         </div>
      </div>
   );
}

function LoginScreen({ onGoogleLogin }) {
   return (
      <div className="flex justify-center items-center min-h-screen">
         <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
               <h2 className="card-title">Acceso Restringido</h2>
               <p className="mb-4">Esta sección requiere autenticación</p>
               <button onClick={onGoogleLogin} className="btn btn-primary gap-2">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                     <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                  </svg>
                  Iniciar con Google
               </button>
            </div>
         </div>
      </div>
   );
}

function MetadataForm({ data, onUpdate }) {
   const [formData, setFormData] = useState({
      lastNames: data?.lastNames || '',
      lastPeriod: data?.lastPeriod ? new Date(data.lastPeriod.seconds * 1000).toISOString().split('T')[0] : '',
      dayOfBirth: data?.dayOfBirth ? new Date(data.dayOfBirth.seconds * 1000).toISOString().split('T')[0] : '',
      revelationDay: data?.revelationDay ? new Date(data.revelationDay.seconds * 1000).toISOString().split('T')[0] : ''
   });

   const handleSubmit = () => {
      const updatedData = {
         lastNames: formData.lastNames,
         lastPeriod: {
            seconds: Math.floor(new Date(formData.lastPeriod).getTime() / 1000),
            nanoseconds: (new Date(formData.lastPeriod).getTime() % 1000) * 1000000
         },
         dayOfBirth: {
            seconds: Math.floor(new Date(formData.dayOfBirth).getTime() / 1000),
            nanoseconds: (new Date(formData.dayOfBirth).getTime() % 1000) * 1000000
         },
         revelationDay: {
            seconds: Math.floor(new Date(formData.revelationDay).getTime() / 1000),
            nanoseconds: (new Date(formData.revelationDay).getTime() % 1000) * 1000000
         }
      };
      onUpdate(updatedData);
   };

   return (
      <div className="space-y-4">
         <div>
            <label className="label">
               <span className="label-text">Apellidos</span>
            </label>
            <input
               type="text"
               className="input input-bordered w-full"
               value={formData.lastNames}
               onChange={(e) => setFormData({ ...formData, lastNames: e.target.value })}
            />
         </div>
         <div>
            <label className="label">
               <span className="label-text">Último Período</span>
            </label>
            <input
               type="date"
               className="input input-bordered w-full"
               value={formData.lastPeriod}
               onChange={(e) => setFormData({ ...formData, lastPeriod: e.target.value })}
            />
         </div>
         <div>
            <label className="label">
               <span className="label-text">Día de Nacimiento</span>
            </label>
            <input
               type="date"
               className="input input-bordered w-full"
               value={formData.dayOfBirth}
               onChange={(e) => setFormData({ ...formData, dayOfBirth: e.target.value })}
            />
         </div>
         <div>
            <label className="label">
               <span className="label-text">Día de Revelación</span>
            </label>
            <input
               type="date"
               className="input input-bordered w-full"
               value={formData.revelationDay}
               onChange={(e) => setFormData({ ...formData, revelationDay: e.target.value })}
            />
         </div>
         <div className="card-actions justify-end mt-4">
            <button className="btn btn-ghost" onClick={() => onUpdate(data)}>
               Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
               Guardar
            </button>
         </div>
      </div>
   );
}

function BabyForm({ data = {}, onUpdate }) {
   const [formData, setFormData] = useState({
      male: {
         first_name: data.sex?.male?.first_name || '',
         second_name: data.sex?.male?.second_name || '',
         meaning: data.sex?.male?.meaning || '',
         is: data.sex?.male?.is || false
      },
      female: {
         first_name: data.sex?.female?.first_name || '',
         second_name: data.sex?.female?.second_name || '',
         meaning: data.sex?.female?.meaning || '',
         is: data.sex?.female?.is || false
      }
   });

   const handleGenderSelect = (gender) => {
      setFormData((prevData) => ({
         male: { ...prevData.male, is: gender === 'male' },
         female: { ...prevData.female, is: gender === 'female' }
      }));
   };

   const handleSubmit = () => {
      const updatedData = {
         sex: {
            male: formData.male,
            female: formData.female
         }
      };
      onUpdate(updatedData);
   };

   return (
      <div className="space-y-4">
         <div>
            <h3 className="text-lg font-bold">Masculino</h3>
            <div className="flex space-x-4">
               <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Primer Nombre"
                  value={formData.male.first_name}
                  onChange={(e) => setFormData({ ...formData, male: { ...formData.male, first_name: e.target.value } })}
               />
               <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Segundo Nombre"
                  value={formData.male.second_name}
                  onChange={(e) => setFormData({ ...formData, male: { ...formData.male, second_name: e.target.value } })}
               />
            </div>
            <textarea
               className="textarea textarea-bordered mt-2"
               placeholder="Significado"
               value={formData.male.meaning}
               onChange={(e) => setFormData({ ...formData, male: { ...formData.male, meaning: e.target.value } })}
            />
            <div className="flex items-center mt-2">
               <input
                  type="checkbox"
                  className="checkbox"
                  checked={formData.male.is}
                  onChange={() => handleGenderSelect('male')}
               />
               <span className="ml-2">Seleccionado</span>
            </div>
         </div>

         <div>
            <h3 className="text-lg font-bold">Femenino</h3>
            <div className="flex space-x-4">
               <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Primer Nombre"
                  value={formData.female.first_name}
                  onChange={(e) => setFormData({ ...formData, female: { ...formData.female, first_name: e.target.value } })}
               />
               <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Segundo Nombre"
                  value={formData.female.second_name}
                  onChange={(e) => setFormData({ ...formData, female: { ...formData.female, second_name: e.target.value } })}
               />
            </div>
            <textarea
               className="textarea textarea-bordered mt-2"
               placeholder="Significado"
               value={formData.female.meaning}
               onChange={(e) => setFormData({ ...formData, female: { ...formData.female, meaning: e.target.value } })}
            />
            <div className="flex items-center mt-2">
               <input
                  type="checkbox"
                  className="checkbox"
                  checked={formData.female.is}
                  onChange={() => handleGenderSelect('female')}
               />
               <span className="ml-2">Seleccionado</span>
            </div>
         </div>

         <div className="card-actions justify-end mt-4">
            <button className="btn btn-ghost" onClick={() => onUpdate(data)}>
               Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
               Guardar
            </button>
         </div>
      </div>
   );
}

function ConfigSection({ title, data, onUpdate }) {
   const [editing, setEditing] = useState(false);
   const [editedData, setEditedData] = useState(data);
   const [error, setError] = useState(null);

   const handleSave = (newData) => {
      const currentDate = new Date();
      const revelationDate = data.revelationDay ? new Date(data.revelationDay.seconds * 1000) : null;

      if (newData.sex.male.is || newData.sex.female.is) {
         if (revelationDate && revelationDate > currentDate) {
            setError(`No se puede revelar el sexo hasta el ${revelationDate.toLocaleDateString('es-ES')}`);
            return;
         }
         const confirmReveal = window.confirm('¿Está seguro que desea revelar el sexo?');
         if (!confirmReveal) {
            return;
         }
      }

      const updatedData = {
         ...newData,
         sex: {
            male: {
               ...newData.sex.male,
               is: newData.sex.male.is !== undefined ? newData.sex.male.is : false
            },
            female: {
               ...newData.sex.female,
               is: newData.sex.female.is !== undefined ? newData.sex.female.is : false
            }
         }
      };

      setEditedData(updatedData);
      onUpdate(updatedData);
      setEditing(false);
   };

   const handleResetSelection = () => {
      const resetData = {
         ...editedData,
         sex: {
            male: { ...editedData.sex.male, is: false },
            female: { ...editedData.sex.female, is: false }
         }
      };
      setEditedData(resetData);
      onUpdate(resetData);
   };

   if (!data) {
      return null; // No mostrar nada si no hay datos
   }

   const displayData = {
      lastNames: data?.lastNames || 'N/A',
      lastPeriod: convertTimestampToDate(data?.lastPeriod),
      dayOfBirth: convertTimestampToDate(data?.dayOfBirth),
      revelationDay: convertTimestampToDate(data?.revelationDay)
   };

   const sexData = data.sex || { male: {}, female: {} };
   const wasRevealed = sexData.male.is || sexData.female.is;

   return (
      <div className="card bg-base-100 shadow-xl">
         <div className="card-body">
            <h2 className="card-title">{title}</h2>
            {editing ? (
               title === "Metadatos" ? (
                  <MetadataForm data={data} onUpdate={handleSave} />
               ) : title === "Bebé" ? (
                  <BabyForm data={data} onUpdate={handleSave} />
               ) : (
                  <>
                     <textarea
                        className="textarea textarea-bordered h-48"
                        value={JSON.stringify(editedData, null, 2)}
                        onChange={(e) => {
                           try {
                              setEditedData(JSON.parse(e.target.value));
                           } catch (err) {
                              // Ignorar errores de parsing
                           }
                        }}
                     />
                     <div className="card-actions justify-end">
                        <button className="btn btn-ghost" onClick={() => setEditing(false)}>
                           Cancelar
                        </button>
                        <button className="btn btn-primary" onClick={() => handleSave(editedData)}>
                           Guardar
                        </button>
                     </div>
                  </>
               )
            ) : (
               title === "Metadatos" ? (
                  <div className="space-y-2">
                     <div>
                        <strong>Apellidos:</strong> {displayData.lastNames}
                     </div>
                     <div>
                        <strong>Último Período:</strong> {displayData.lastPeriod}
                     </div>
                     <div>
                        <strong>Día de Nacimiento:</strong> {displayData.dayOfBirth}
                     </div>
                     <div>
                        <strong>Día de Revelación:</strong> {displayData.revelationDay}
                     </div>
                  </div>
               ) : title === "Bebé" ? (
                  <div className="space-y-4">
                     {wasRevealed && <div className="badge badge-success">Ya fue revelado</div>}
                     <h3 className="text-lg font-bold">Masculino</h3>
                     <div>
                        <strong>Nombre:</strong> {sexData.male.first_name || 'N/A'} {sexData.male.second_name || 'N/A'}
                     </div>
                     <div>
                        <strong>Significado:</strong> {sexData.male.meaning || 'N/A'}
                     </div>
                     <div>
                        <strong>Seleccionado:</strong> {sexData.male.is ? 'Sí' : 'No'}
                     </div>

                     <h3 className="text-lg font-bold">Femenino</h3>
                     <div>
                        <strong>Nombre:</strong> {sexData.female.first_name || 'N/A'} {sexData.female.second_name || 'N/A'}
                     </div>
                     <div>
                        <strong>Significado:</strong> {sexData.female.meaning || 'N/A'}
                     </div>
                     <div>
                        <strong>Seleccionado:</strong> {sexData.female.is ? 'Sí' : 'No'}
                     </div>

                     <div className="card-actions justify-end">
                        <button className="btn btn-warning" onClick={handleResetSelection}>
                           Resetear Selección
                        </button>
                     </div>
                  </div>
               ) : (
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                     {JSON.stringify(data, null, 2)}
                  </pre>
               )
            )}
            {editing ? (
               <></>
            ) : (
               <div className="card-actions justify-end">
                  <button className="btn btn-primary" onClick={() => setEditing(true)}>
                     Editar
                  </button>
               </div>
            )}
            {error && (
               <div className="alert alert-error">
                  <div>
                     <span>{error}</span>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

function UserManagement() {
   // Implementar gestión de usuarios aquí
   return (
      <div className="card bg-base-100 shadow-xl">
         <div className="card-body">
            <h2 className="card-title">Gestión de Usuarios</h2>
            {/* Implementar interfaz para gestionar roles de usuario */}
         </div>
      </div>
   );
}

function convertTimestampToDate(timestamp) {
   if (!timestamp) return 'N/A';
   const date = new Date((timestamp.seconds + timestamp.nanoseconds / 1e9) * 1000);
   date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajustar la zona horaria
   return date.toLocaleDateString('es-ES');
}