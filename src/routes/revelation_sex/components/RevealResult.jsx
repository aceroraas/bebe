import React from 'react';
import { Stars } from 'lucide-react';
import { useConfigData } from '../../../shared/services/getConfig';

export function RevealResult() {
   const { config, loading, error } = useConfigData();
   if (!config || !Array.isArray(config)) return null;
   
   const babyConfig = config.find(conf => conf.item === 'baby')?.data;
   const sex = babyConfig?.sex ?? "none";

   return (
      <div className="space-y-8 animate-fadeIn">
         <div className="flex flex-col items-center gap-6">
            <h2 className={`text-5xl font-bold ${sex === "boy" ? "text-blue-500" : sex === "girl" ? "text-pink-500" : ""} animate-pulse`}>
               {sex === "boy" ? "¡Es un Principe!" : sex === "girl" ? "¡Es una Princesa!" : "none"}
            </h2>
            <p className="text-gray-600 text-xl">
               {sex === "boy" ? "¡Bienvenido Principe!" : sex === "girl" ? "¡Bienvenida Princesa!" : ""} Que tu vida esté llena de amor y alegría.
            </p>
         </div>
         <div className="flex justify-center gap-4">
            {[...Array(5)].map((_, i) => (
               <Stars
                  key={i}
                  className={`w-8 h-8 ${sex === "boy" ? "text-blue-500" : sex === "girl" ? "text-pink-500" : ""} animate-spin-slow`}
                  style={{ animationDelay: `${i * 0.2}s` }}
               />
            ))}
         </div>
      </div>
   );
}
