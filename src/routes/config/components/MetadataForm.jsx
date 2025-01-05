import { useState } from 'react';

export default function MetadataForm({ data, onUpdate }) {
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
