import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ChatIcon from "./chatIcon";
import CogIcon from "./cogIcon";
import CursorIcon from "./cursorIcon";
import EditIcon from "./editIcon";
import ItalicIcon from "./italicIcon";
import QuadroIcon from "./quadroIcon";
import SparklesIcon from "./sparklesIcon";
import { useConfig } from "./services/getConfig";

export default function NavigatorFixed() {
   const location = useLocation();
   const navigate = useNavigate();
   const isHome = location.pathname === '/';

   return <div className="navbar bg-gradient-to-r from-error to-sky-400 shadow-lg ">
      <div className="navbar-start ">
         {isHome ? (
            <FamilyLastName />
         ) : (
            <button onClick={() => navigate('/')} className="btn btn-ghost text-white">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
               </svg>
               Inicio
            </button>
         )}
      </div>
      {isHome && (
         <div className="navbar-center">
            <div className="flex flex-col items-center">
               <CountdownBirth />
               <TimeOfPregnant />
            </div>
         </div>
      )}
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
                     <Link className="btn rounded-xl" to="/revelacion">
                        <SparklesIcon />
                     </Link>
                  </div>
                  <div className="tooltip" data-tip="Configuración">
                     <Link className="btn rounded-xl" to="/configuracion">
                        <CogIcon />
                     </Link>
                  </div>
                  <div className="tooltip" data-tip="Actividades del bebe">
                     <Link className="btn rounded-xl" to="/bebe">
                        <ChatIcon />
                     </Link>
                  </div>
                  <div className="tooltip" data-tip="Votación">
                     <Link className="btn rounded-xl" to="/votacion">
                        <CursorIcon />
                     </Link>
                  </div>
                  <div className="tooltip" data-tip="Nombres para el bebe">
                     <Link className="btn rounded-xl" to="/nombres">
                        <EditIcon />
                     </Link>
                  </div>
                  <div className="tooltip" data-tip="Descubre el Nombre">
                     <Link className="btn rounded-xl" to="/descubrelo">
                        <ItalicIcon />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
}



function CountdownBirth() {
   const { config, loading, error } = useConfig();
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
   const { config, loading, error } = useConfig();
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
   const { config, loading, error } = useConfig();
   if (loading) return <div className="text-white text-sm md:text-white  md:badge md:badge-lg md:badge-outline  md:text-xl">Cargando...</div>;
   if (error) return <div className="text-white text-sm md:text-white  md:badge md:badge-lg md:badge-outline  md:text-xl">----</div>;
   const metadata = config?.find(conf => conf.item === 'metadata')?.data;
   return <div className="text-white text-sm md:text-white  md:badge md:badge-lg md:badge-outline  md:text-xl">{metadata.lastNames}</div>
}