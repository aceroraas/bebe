import React from 'react';
import { useConfig } from '../../../shared/services/getConfig';

export default function RevealButton({ onReveal, isAnimating, isEnabled, gender }) {
   return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 mb-8">
            ¿Listo para descubrir el secreto?
         </h2>

         <div className="flex flex-col gap-4 w-full max-w-md">
            <button
               onClick={onReveal}
               disabled={!isEnabled || isAnimating}
               className={`
                  btn btn-lg text-xl font-bold bg-white text-gray-800 border-gray-200 hover:bg-gray-50
                  ${isAnimating ? 'animate-pulse' : ''}
                  ${!isEnabled ? 'btn-disabled' : ''}
               `}
            >
               {isAnimating ? (
                  <span className="loading loading-spinner loading-md"></span>
               ) : (
                  <>
                     {!isEnabled ? (
                        'Esperando la revelación...'
                     ) : (
                        'Revelar'
                     )}
                  </>
               )}
            </button>

            <p className="text-gray-600 text-sm">
               {!isEnabled ? (
                  "El revelador aun no ha selecionado el secreto"
               ) : (
                  "¡Haz click en el botón para revelar la sorpresa!"
               )}
            </p>
         </div>
      </div>
   );
}

export function CountDownRevealButton({ onReveal, isAnimating, isEnabled }) {
   const { config, loading, error } = useConfig();
   if (!config || !Array.isArray(config)) return null;

   const metadata = config.find(conf => conf.item === 'metadata')?.data;

   if (loading) return <div className="italic text-gray-600 text-sm md:text-xl">Cargando...</div>;
   if (error) return <div className="italic text-red-500 text-sm md:text-xl">Error al cargar la configuración</div>;

   let weeks = 0;
   let days = 0;
   let diffTime = 0;

   if (metadata?.revelationDay) {
      const birthDate = new Date(metadata.revelationDay.seconds * 1000);
      const currentDate = new Date();
      diffTime = birthDate - currentDate;

      if (diffTime > 0) {
         const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
         weeks = Math.min(99, Math.floor(totalDays / 7));
         days = Math.min(99, totalDays % 7);
      }
   }

   if (diffTime > 0) {
      return (
         <div className="flex flex-col items-center gap-2 italic text-gray-800 text-sm md:text-xl">
            <span className="font-medium">Aun faltan </span>
            <div className="flex gap-2">
               {weeks > 0 && (
                  <div>
                     <span className="countdown font-mono">
                        <span style={{ "--value": weeks }}></span>
                     </span>
                     &nbsp;Semanas
                  </div>
               )}
               {days > 0 && (
                  <div>
                     <span className="countdown font-mono">
                        <span style={{ "--value": days }}></span>
                     </span>
                     &nbsp;Días
                  </div>
               )}
            </div>
            <span className="font-medium">Para la Revelación </span>
         </div>
      );
   }

   return (
      <RevealButton onReveal={onReveal} isAnimating={isAnimating} isEnabled={isEnabled} />
   );
}