import { useEffect, useState } from "react";
import ChatIcon from "./chatIcon";
import CogIcon from "./cogIcon";
import CursorIcon from "./cursorIcon";
import EditIcon from "./editIcon";
import ItalicIcon from "./italicIcon";
import QuadroIcon from "./quadroIcon";
import SparklesIcon from "./sparklesIcon";
import { getConfig, useConfigData } from "./services/getConfig";

export default function NavigatorFixed() {
   return <div className="navbar bg-gradient-to-r from-error to-sky-400 shadow-lg ">
      <div className="navbar-start ">
         <FamilyLastName />
      </div>
      <div className="navbar-center">
         <div className="flex flex-col items-center">
            <CountdownBirth />
            <TimeOfPregnant />
         </div>
      </div>
      <div className="navbar-end">
         <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-white shadow-lg">
               <div className="tooltip tooltip-left" data-tip="Menu">
                  <QuadroIcon />
               </div>
            </div>
            <div tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg">
               <div className="grid grid-cols-2 grid-rows-3 gap-2 items-center justify-center p-3">
                  <div className="tooltip" data-tip="Revelación de sexo">
                     <button className="btn rounded-xl">
                        <SparklesIcon />
                     </button>
                  </div>
                  <div className="tooltip" data-tip="Configuración">
                     <button className="btn rounded-xl">
                        <CogIcon />
                     </button>
                  </div>
                  <div className="tooltip" data-tip="Actividades del bebe">
                     <button className="btn rounded-xl">
                        <ChatIcon />
                     </button>
                  </div>
                  <div className="tooltip" data-tip="Votación">
                     <button className="btn rounded-xl">
                        <CursorIcon />
                     </button>
                  </div>
                  <div className="tooltip" data-tip="Nombres para el bebe">
                     <button className="btn rounded-xl">
                        <EditIcon />
                     </button>
                  </div>
                  <div className="tooltip" data-tip="Descubre el Nombre">
                     <button className="btn rounded-xl">
                        <ItalicIcon />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
}



function CountdownBirth() {
   const { config, loading, error } = useConfigData();
   const metadata = config?.find(conf => conf.item === 'metadata')?.data;

   if (loading) return <div className="italic text-white text-sm md:text-xl">Cargando...</div>;
   if (error) return <div className="italic text-white text-sm md:text-xl">----</div>;

   let weeks = 0;
   let days = 0;

   if (metadata?.dayOfBirth) {
      const birthDate = new Date(metadata.dayOfBirth.seconds * 1000);
      const currentDate = new Date();
      const diffTime = birthDate - currentDate;

      if (diffTime > 0) {
         const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
         weeks = Math.min(99, Math.floor(totalDays / 7));
         days = Math.min(99, totalDays % 7);
      }
   }

   return <div className="flex flex-col md:flex-row items-center gap-2 italic text-white text-sm md:text-xl">
      <span className="font-medium">Te Conoceremos en </span>
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
   </div>
}


function TimeOfPregnant() {
   const { config, loading, error } = useConfigData();
   const metadata = config?.find(conf => conf.item === 'metadata')?.data;

   if (loading) return <div className="italic text-white text-sm md:text-xl">Cargando...</div>;
   if (error) return <div className="italic text-white text-sm md:text-xl">----</div>;

   // Calcular semanas desde el último período
   const lastPeriodDate = new Date(metadata?.lastPeriod?.seconds * 1000);
   const currentDate = new Date();
   const diffTime = currentDate - lastPeriodDate;
   const weeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

   return <div className="flex flex-row items-center gap-2 italic text-white text-sm md:text-xl">
      <span className="font-medium">Tienes </span>
      <div className="flex gap-2">
         {weeks > 0 && weeks <= 42 && (
            <div>
               <span className="countdown font-mono">
                  <span style={{ "--value": Math.min(99, weeks) }}></span>
               </span>
               Semanas
            </div>
         )}
      </div>
   </div>
}

function FamilyLastName() {
   const { config, loading, error } = useConfigData();
   if (loading) return <div className="text-white text-sm md:text-white  md:badge md:badge-lg md:badge-outline  md:text-xl">Cargando...</div>;
   if (error) return <div className="text-white text-sm md:text-white  md:badge md:badge-lg md:badge-outline  md:text-xl">----</div>;
   const metadata = config?.find(conf => conf.item === 'metadata')?.data;
   return <div className="text-white text-sm md:text-white  md:badge md:badge-lg md:badge-outline  md:text-xl">{metadata.lastNames}</div>
}