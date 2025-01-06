import { useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { getUsers, updateUserRole, AVAILABLE_ROLES, preAuthorizeEmail } from '../../../shared/services/userService';
import { setupAuthListener } from '../../../shared/services/authService';

export default function UserManagement() {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [currentUser, setCurrentUser] = useState(null);
   const [registering, setRegistering] = useState(false);
   const [showModal, setShowModal] = useState(false);
   const [newUser, setNewUser] = useState({ 
      username: '', 
      role: 'invitado' 
   });

   useEffect(() => {
      const unsubscribe = setupAuthListener((user) => {
         setCurrentUser(user);
      });

      return () => unsubscribe();
   }, []);

   useEffect(() => {
      fetchUsers();
   }, []);

   const fetchUsers = async () => {
      try {
         setLoading(true);
         const fetchedUsers = await getUsers();
         setUsers(fetchedUsers);
         setError(null);
      } catch (err) {
         console.error('Error fetching users:', err);
         setError('Error al cargar los usuarios');
      } finally {
         setLoading(false);
      }
   };

   const handleRoleUpdate = async (userId, newRole) => {
      try {
         await updateUserRole(userId, newRole);
         await fetchUsers(); // Recargar la lista de usuarios
         setError(null);
      } catch (err) {
         console.error('Error updating role:', err);
         setError('Error al actualizar el rol');
      }
   };

   const handlePreAuthorize = async () => {
      if (registering) return;

      try {
         setRegistering(true);
         setError(null);

         if (!newUser.username) {
            setError('Por favor ingrese un nombre de usuario');
            return;
         }

         const email = `${newUser.username}@gmail.com`;
         const result = await preAuthorizeEmail(email, newUser.role);
         
         if (result.success) {
            await fetchUsers(); // Recargar la lista después de añadir
            setShowModal(false);
            setNewUser({ username: '', role: 'invitado' });
         } else if (result.error) {
            setError(result.error);
         }
      } catch (err) {
         console.error('Error pre-authorizing user:', err);
         setError('Error al pre-autorizar el usuario');
      } finally {
         setRegistering(false);
      }
   };

   if (!currentUser?.role || currentUser.role !== 'admin') {
      return (
         <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
               <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>No tienes permisos para gestionar usuarios.</span>
               </div>
            </div>
         </div>
      );
   }

   if (loading) {
      return (
         <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
               <div className="flex justify-center">
                  <span className="loading loading-spinner loading-lg"></span>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="card bg-base-100 shadow-xl">
         <div className="card-body">
            <div className="flex justify-between items-center mb-4">
               <h2 className="card-title">Gestión de Usuarios</h2>
               <button 
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
               >
                  Pre-autorizar Usuario
               </button>
            </div>

            {error && (
               <div className="alert alert-error mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
               </div>
            )}

            <div className="overflow-x-auto">
               <table className="table">
                  <thead>
                     <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                     </tr>
                  </thead>
                  <tbody>
                     {users.map(user => (
                        <tr key={user.id}>
                           <td>{user.name || 'Sin nombre'}</td>
                           <td>{user.email}</td>
                           <td>
                              <select
                                 className="select select-bordered select-sm w-full max-w-xs"
                                 value={user.role || 'invitado'}
                                 onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                              >
                                 {AVAILABLE_ROLES.map(role => (
                                    <option key={role} value={role}>
                                       {role}
                                    </option>
                                 ))}
                              </select>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {showModal && (
               <div className="modal modal-open">
                  <div className="modal-box">
                     <h3 className="font-bold text-lg mb-4">Pre-autorizar Nuevo Usuario</h3>
                     <div className="form-control">
                        <label className="label">
                           <span className="label-text">Email</span>
                        </label>
                        <div className="join w-full">
                           <input
                              type="text"
                              placeholder="usuario"
                              className="input input-bordered join-item w-2/3"
                              value={newUser.username}
                              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                           />
                           <div className="input input-bordered join-item w-1/3 flex items-center justify-center bg-base-200 cursor-not-allowed">
                              @gmail.com
                           </div>
                        </div>
                     </div>
                     <div className="form-control mt-4">
                        <label className="label">
                           <span className="label-text">Rol</span>
                        </label>
                        <select
                           className="select select-bordered"
                           value={newUser.role}
                           onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                           {AVAILABLE_ROLES.map(role => (
                              <option key={role} value={role}>
                                 {role}
                              </option>
                           ))}
                        </select>
                     </div>
                     <div className="modal-action">
                        <button 
                           className={`btn btn-primary ${registering ? 'loading' : ''}`}
                           onClick={handlePreAuthorize}
                           disabled={registering}
                        >
                           {registering ? 'Pre-autorizando...' : 'Pre-autorizar'}
                        </button>
                        <button 
                           className="btn"
                           onClick={() => {
                              setShowModal(false);
                              setNewUser({ username: '', role: 'invitado' });
                              setError(null);
                           }}
                        >
                           Cancelar
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
