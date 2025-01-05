import React, { useState, useEffect } from 'react';
import { updateRevelacion, getRevelacionData } from '../../../shared/services/revelacionService';

const GENDER_OPTIONS = {
   none: { label: 'No revelado', color: 'btn-neutral' },
   boy: { label: 'Niño', color: 'btn-primary' },
   girl: { label: 'Niña', color: 'btn-secondary' }
};

export default function Revelacion() {
   const [gender, setGender] = useState('none');
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   useEffect(() => {
      loadGender();
   }, []);

   const loadGender = async () => {
      try {
         setLoading(true);
         const data = await getRevelacionData();
         console.log('Datos cargados en configuración:', data);
         setGender(data.gender || 'none');
      } catch (err) {
         console.error('Error al cargar el género:', err);
         setError('Error al cargar la configuración');
      } finally {
         setLoading(false);
      }
   };

   const handleGenderChange = async (newGender) => {
      if (newGender === gender) return;

      // Si está cambiando de 'none' a un género, pedir confirmación
      if (gender === 'none' && newGender !== 'none') {
         const confirmChange = window.confirm('¿Estás seguro de revelar el género? Esta acción no se puede deshacer.');
         if (!confirmChange) return;
      }

      try {
         setSaving(true);
         setError(null);
         setSuccess(false);
         console.log('Cambiando género a:', newGender);
         await updateRevelacion(newGender);
         setGender(newGender);
         setSuccess(true);
         console.log('Género actualizado exitosamente a:', newGender);

         // Limpiar el mensaje de éxito después de 3 segundos
         setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
         console.error('Error al actualizar el género:', err);
         setError('Error al guardar la configuración');
      } finally {
         setSaving(false);
      }
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center p-4">
            <div className="loading loading-spinner loading-lg"></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
         </div>
      );
   }

   return (
      <div className="card bg-base-100 shadow-xl">
         <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Configuración de Revelación</h2>
            
            <div className="space-y-6">
               <div className="flex flex-col gap-6">
                  <button
                     onClick={() => handleGenderChange('boy')}
                     disabled={saving}
                     className={`
                        btn btn-lg text-xl font-bold h-32
                        bg-blue-500 hover:bg-blue-600 text-white border-blue-600
                        disabled:bg-blue-300
                        transition-all duration-200
                     `}
                  >
                     <div className="flex items-center gap-3">
                        <span className="text-4xl">👦</span>
                        <span>Niño</span>
                     </div>
                  </button>

                  <button
                     onClick={() => handleGenderChange('girl')}
                     disabled={saving}
                     className={`
                        btn btn-lg text-xl font-bold h-32
                        bg-pink-500 hover:bg-pink-600 text-white border-pink-600
                        disabled:bg-pink-300
                        transition-all duration-200
                     `}
                  >
                     <div className="flex items-center gap-3">
                        <span className="text-4xl">👧</span>
                        <span>Niña</span>
                     </div>
                  </button>

                  <button
                     onClick={() => handleGenderChange('none')}
                     disabled={saving}
                     className={`
                        btn btn-lg text-xl font-bold h-16
                        bg-gray-500 hover:bg-gray-600 text-white border-gray-600
                        disabled:bg-gray-300
                        transition-all duration-200
                     `}
                  >
                     Limpiar Selección
                  </button>
               </div>

               {saving && (
                  <div className="alert">
                     <span className="loading loading-spinner"></span>
                     <span>Guardando...</span>
                  </div>
               )}

               {error && (
                  <div className="alert alert-error">
                     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <span>{error}</span>
                  </div>
               )}

               {success && (
                  <div className="alert alert-success">
                     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <span>¡Configuración guardada con éxito!</span>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
