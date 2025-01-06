import { useState } from 'react';
import MetadataForm from './MetadataForm';
import BabyForm from './BabyForm';
import { convertTimestampToDate } from '../utils';

export default function ConfigSection({ title, data, onUpdate }) {
   const [editing, setEditing] = useState(false);
   const [editedData, setEditedData] = useState(data);
   const [error, setError] = useState(null);

   const handleSave = (newData) => {
      setEditedData(newData);
      onUpdate(newData);
      setEditing(false);
   };

   if (!data) {
      return null;
   }

   const displayData = {
      lastNames: data?.lastNames || 'N/A',
      lastPeriod: convertTimestampToDate(data?.lastPeriod),
      dayOfBirth: convertTimestampToDate(data?.dayOfBirth),
      revelationDay: convertTimestampToDate(data?.revelationDay)
   };

   const maleData = {
      first_name: data?.sex?.male?.first_name || 'N/A',
      second_name: data?.sex?.male?.second_name || 'N/A',
      meaning: data?.sex?.male?.meaning || 'N/A'
   };

   const femaleData = {
      first_name: data?.sex?.female?.first_name || 'N/A',
      second_name: data?.sex?.female?.second_name || 'N/A',
      meaning: data?.sex?.female?.meaning || 'N/A'
   };

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
                  <div className="space-y-8">
                     <div>
                        <h3 className="text-lg font-semibold mb-2">Nombre Masculino</h3>
                        <div>
                           <strong>Nombre:</strong> {maleData.first_name} {maleData.second_name}
                        </div>
                        <div>
                           <strong>Significado:</strong> {maleData.meaning}
                        </div>
                     </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2">Nombre Femenino</h3>
                        <div>
                           <strong>Nombre:</strong> {femaleData.first_name} {femaleData.second_name}
                        </div>
                        <div>
                           <strong>Significado:</strong> {femaleData.meaning}
                        </div>
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
