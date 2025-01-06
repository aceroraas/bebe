import { useState } from 'react';

export default function MetadataForm({ data, onUpdate }) {
   // Función para convertir timestamp de Firestore a formato YYYY-MM-DD
   const timestampToDateString = (timestamp) => {
      if (!timestamp?.seconds) return '';
      const date = new Date(timestamp.seconds * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
   };

   // Función para convertir fecha YYYY-MM-DD a timestamp de Firestore
   const dateStringToTimestamp = (dateString) => {
      if (!dateString) return null;
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day, 12, 0, 0); // Usamos mediodía para evitar problemas de zona horaria
      return {
         seconds: Math.floor(date.getTime() / 1000),
         nanoseconds: 0
      };
   };

   const [formData, setFormData] = useState({
      lastNames: data?.lastNames || '',
      lastPeriod: timestampToDateString(data?.lastPeriod),
      dayOfBirth: timestampToDateString(data?.dayOfBirth),
      revelationDay: timestampToDateString(data?.revelationDay)
   });

   const handleSubmit = () => {
      const updatedData = {
         lastNames: formData.lastNames,
         lastPeriod: dateStringToTimestamp(formData.lastPeriod),
         dayOfBirth: dateStringToTimestamp(formData.dayOfBirth),
         revelationDay: dateStringToTimestamp(formData.revelationDay)
      };

      console.log('Guardando datos:', {
         original: formData,
         converted: updatedData
      });

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
               <span className="label-text">Fecha Probable de Parto</span>
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
               <span className="label-text">Día de la Revelación</span>
            </label>
            <input
               type="date"
               className="input input-bordered w-full"
               value={formData.revelationDay}
               onChange={(e) => setFormData({ ...formData, revelationDay: e.target.value })}
            />
         </div>
         <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={handleSubmit}>
               Guardar
            </button>
         </div>
      </div>
   );
}
