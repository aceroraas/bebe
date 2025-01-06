import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { getAllUsersWithNames, removeName } from '../../shared/services/namesService';
import { AddNameModal } from './components/AddNameModal';
import { NameCard } from './components/NameCard';
import { UserSearch } from './components/UserSearch';
import { LoginMessage } from './components/LoginMessage';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import '../../styles/animations.css';

export default function NamesByUsers() {
   const { currentUser } = useAuth();
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedUser, setSelectedUser] = useState(null);
   const [deletingName, setDeletingName] = useState(false);

   useEffect(() => {
      loadUsers();
   }, []);

   const loadUsers = async () => {
      try {
         setLoading(true);
         const usersData = await getAllUsersWithNames();
         setUsers(usersData);
      } catch (error) {
         console.error('Error loading users:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleUserSelected = (user) => {
      setSelectedUser(user);
   };

   const handleDeleteName = async (nameToDelete) => {
      if (!currentUser || deletingName) return;

      try {
         setDeletingName(true);
         await removeName(currentUser.uid, nameToDelete);
         await loadUsers();
      } catch (error) {
         console.error('Error deleting name:', error);
      } finally {
         setDeletingName(false);
      }
   };

   const handleGoogleLogin = async () => {
      try {
         const provider = new GoogleAuthProvider();
         await signInWithPopup(auth, provider);
      } catch (error) {
         console.error('Error signing in with Google:', error);
      }
   };

   if (!currentUser) {
      return (
         <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
               <div className="card bg-base-100 shadow-xl">
                  <div className="card-body items-center text-center">
                     <LoginMessage onLogin={handleGoogleLogin} />
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
         <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-6">
               {/* Buscador */}
               <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                     <div className="flex items-center gap-4">
                        <h2 className="card-title whitespace-nowrap">Buscar por Usuario</h2>
                        <UserSearch 
                           onUserSelected={handleUserSelected} 
                           onClear={() => setSelectedUser(null)}
                        />
                     </div>
                  </div>
               </div>

               {/* Lista de Nombres */}
               <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                     {selectedUser ? (
                        <>
                           <div className="flex items-center gap-4 mb-6">
                              <h2 className="card-title">Nombres sugeridos por {selectedUser.displayName}</h2>
                              <button 
                                 className="btn btn-ghost btn-sm"
                                 onClick={() => setSelectedUser(null)}
                              >
                                 Ver todos
                              </button>
                           </div>
                           <div className="flex flex-wrap gap-4 justify-center">
                              {selectedUser.names?.map((name, index) => (
                                 <NameCard
                                    key={`${selectedUser.id}-${index}`}
                                    user={selectedUser}
                                    name={name}
                                    currentUserId={currentUser.uid}
                                    onDelete={handleDeleteName}
                                 />
                              ))}
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="text-center mb-8 space-y-2">
                              <h2 className="card-title justify-center text-2xl">Nombres Sugeridos</h2>
                              <p className="text-gray-600">Cada nombre es especial y único, como el bebé que viene en camino.</p>
                              <p className="text-gray-600">¿Tienes una sugerencia? ¡Compártela con nosotros!</p>
                           </div>
                           {loading || deletingName ? (
                              <div className="flex justify-center items-center p-8">
                                 <span className="loading loading-spinner loading-lg"></span>
                              </div>
                           ) : (
                              <div className="flex flex-wrap gap-4 justify-center">
                                 {users.flatMap((user) =>
                                    user.names?.map((name, index) => (
                                       <NameCard
                                          key={`${user.id}-${index}`}
                                          user={user}
                                          name={name}
                                          currentUserId={currentUser.uid}
                                          onDelete={handleDeleteName}
                                       />
                                    )) || []
                                 )}
                              </div>
                           )}
                        </>
                     )}
                  </div>
               </div>
            </div>

            {/* Botón flotante para agregar */}
            <button
               className="fixed bottom-6 right-6 btn btn-circle btn-lg btn-primary"
               onClick={() => setIsModalOpen(true)}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M12 4v16m8-8H4"
                  />
               </svg>
            </button>

            {/* Modal para agregar nombre */}
            <AddNameModal
               isOpen={isModalOpen}
               onClose={() => setIsModalOpen(false)}
               userId={currentUser.uid}
               onNameAdded={loadUsers}
            />
         </div>
      </div>
   );
}