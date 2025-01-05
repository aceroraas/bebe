import React from 'react';
import { Baby } from 'lucide-react';
import { useConfigData } from '../../../shared/services/getConfig';

export function RevealButton({ onReveal, isAnimating }) {
   return (
      <div className="space-y-8">
         <div className="flex flex-col items-center gap-4">
            <p className="text-2xl font-medium text-gray-700">
               ¿Será niño o niña?
            </p>
         </div>
         <CountDownRevealButton onReveal={onReveal} isAnimating={isAnimating} />
      </div>
   );
}

function CountDownRevealButton({ onReveal, isAnimating }) {
   const { config, loading, error } = useConfigData();
   if (!config || !Array.isArray(config)) return null;

   const metadata = config.find(conf => conf.item === 'metadata')?.data;

   if (loading) return <div className="italic text-white text-sm md:text-xl">Cargando...</div>;
   if (error) return <div className="italic text-white text-sm md:text-xl">----</div>;

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
   diffTime = 0;// borrar esto
   if (diffTime > 0) {
      return (
         <div className="flex flex-col items-center gap-2 italic text-black text-sm md:text-xl">
            <span className="font-medium">Aun faltan </span>
            <div className="flex gap-2">
               {weeks > 0 && (
                  <div>
                     <span className="countdown font-mono">
                        <span style={{ "--value": weeks }}></span>
                     </span>
                     Semanas
                  </div>
               )}
               {days > 0 && (
                  <div>
                     <span className="countdown font-mono">
                        <span style={{ "--value": days }}></span>
                     </span>
                     Días
                  </div>
               )}
            </div>
            <span className="font-medium">Para la Revelación </span>
         </div>
      );
   }

   return (
      <button
         onClick={onReveal}
         className={`
            px-8 py-4 bg-gradient-to-r from-pink-400 to-blue-400 
            text-white rounded-full text-xl font-semibold
            transform transition hover:scale-105 hover:shadow-lg
            ${isAnimating ? 'animate-bounce' : ''}
         `}
      >
         ¡Revelar Ahora!
      </button>
   );
}