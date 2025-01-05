import { useState } from 'react';

export default function BabyForm({ data = {}, onUpdate }) {
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
   };

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
