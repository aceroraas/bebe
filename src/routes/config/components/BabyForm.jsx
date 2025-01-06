import { useState } from 'react';

export default function BabyForm({ data = {}, onUpdate }) {
   const [editing, setEditing] = useState(false);
   const [formData, setFormData] = useState({
      male: {
         first_name: data?.sex?.male?.first_name || '',
         second_name: data?.sex?.male?.second_name || '',
         meaning: data?.sex?.male?.meaning || '',
         is: data?.sex?.male?.is || false
      },
      female: {
         first_name: data?.sex?.female?.first_name || '',
         second_name: data?.sex?.female?.second_name || '',
         meaning: data?.sex?.female?.meaning || '',
         is: data?.sex?.female?.is || false
      }
   });

   const handleSubmit = () => {
      const updatedData = {
         sex: {
            male: { ...formData.male },
            female: { ...formData.female }
         }
      };
      onUpdate(updatedData);
      setEditing(false);
   };

   if (!editing) {
      return (
         <div className="space-y-4">
            <div className="flex justify-between items-center">
               <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Nombre Masculino</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <span className="text-sm font-medium text-gray-500">Primer Nombre:</span>
                        <p>{formData.male.first_name || 'No definido'}</p>
                     </div>
                     <div>
                        <span className="text-sm font-medium text-gray-500">Segundo Nombre:</span>
                        <p>{formData.male.second_name || 'No definido'}</p>
                     </div>
                  </div>
                  <div className="mt-2">
                     <span className="text-sm font-medium text-gray-500">Significado:</span>
                     <p className="whitespace-pre-wrap">{formData.male.meaning || 'No definido'}</p>
                  </div>
               </div>
            </div>

            <div className="divider"></div>

            <div className="flex justify-between items-center">
               <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Nombre Femenino</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <span className="text-sm font-medium text-gray-500">Primer Nombre:</span>
                        <p>{formData.female.first_name || 'No definido'}</p>
                     </div>
                     <div>
                        <span className="text-sm font-medium text-gray-500">Segundo Nombre:</span>
                        <p>{formData.female.second_name || 'No definido'}</p>
                     </div>
                  </div>
                  <div className="mt-2">
                     <span className="text-sm font-medium text-gray-500">Significado:</span>
                     <p className="whitespace-pre-wrap">{formData.female.meaning || 'No definido'}</p>
                  </div>
               </div>
            </div>

            <div className="flex justify-end mt-4">
               <button 
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
               >
                  Editar
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         {/* Sección Masculino */}
         <div>
            <h3 className="text-lg font-semibold mb-4">Nombre Masculino</h3>
            <div className="flex space-x-4">
               <div className="flex-1">
                  <label className="label">
                     <span className="label-text">Primer Nombre</span>
                  </label>
                  <input
                     type="text"
                     className="input input-bordered w-full"
                     placeholder="Primer Nombre"
                     value={formData.male.first_name}
                     onChange={(e) => setFormData({
                        ...formData,
                        male: { ...formData.male, first_name: e.target.value }
                     })}
                  />
               </div>
               <div className="flex-1">
                  <label className="label">
                     <span className="label-text">Segundo Nombre</span>
                  </label>
                  <input
                     type="text"
                     className="input input-bordered w-full"
                     placeholder="Segundo Nombre"
                     value={formData.male.second_name}
                     onChange={(e) => setFormData({
                        ...formData,
                        male: { ...formData.male, second_name: e.target.value }
                     })}
                  />
               </div>
            </div>
            <div className="mt-4">
               <label className="label">
                  <span className="label-text">Significado</span>
               </label>
               <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Significado del nombre"
                  value={formData.male.meaning}
                  onChange={(e) => setFormData({
                     ...formData,
                     male: { ...formData.male, meaning: e.target.value }
                  })}
               />
            </div>
         </div>

         {/* Sección Femenino */}
         <div>
            <h3 className="text-lg font-semibold mb-4">Nombre Femenino</h3>
            <div className="flex space-x-4">
               <div className="flex-1">
                  <label className="label">
                     <span className="label-text">Primer Nombre</span>
                  </label>
                  <input
                     type="text"
                     className="input input-bordered w-full"
                     placeholder="Primer Nombre"
                     value={formData.female.first_name}
                     onChange={(e) => setFormData({
                        ...formData,
                        female: { ...formData.female, first_name: e.target.value }
                     })}
                  />
               </div>
               <div className="flex-1">
                  <label className="label">
                     <span className="label-text">Segundo Nombre</span>
                  </label>
                  <input
                     type="text"
                     className="input input-bordered w-full"
                     placeholder="Segundo Nombre"
                     value={formData.female.second_name}
                     onChange={(e) => setFormData({
                        ...formData,
                        female: { ...formData.female, second_name: e.target.value }
                     })}
                  />
               </div>
            </div>
            <div className="mt-4">
               <label className="label">
                  <span className="label-text">Significado</span>
               </label>
               <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Significado del nombre"
                  value={formData.female.meaning}
                  onChange={(e) => setFormData({
                     ...formData,
                     female: { ...formData.female, meaning: e.target.value }
                  })}
               />
            </div>
         </div>

         <div className="flex justify-end space-x-2">
            <button 
               className="btn btn-ghost"
               onClick={() => setEditing(false)}
            >
               Cancelar
            </button>
            <button 
               className="btn btn-primary"
               onClick={handleSubmit}
            >
               Guardar
            </button>
         </div>
      </div>
   );
}
