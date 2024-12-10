import ChatIcon from "./chatIcon";
import CogIcon from "./cogIcon";
import CursorIcon from "./cursorIcon";
import EditIcon from "./editIcon";
import ItalicIcon from "./italicIcon";
import QuadroIcon from "./quadroIcon";
import SparklesIcon from "./sparklesIcon";

export default function NavigatorFixed() {
   return <div className="navbar bg-gradient-to-r from-error to-sky-400 shadow-lg ">
      <div className="navbar-start ">
         <div className="text-white text-sm md:text-white  md:badge md:badge-lg md:badge-outline  md:text-xl">Acero Zamora</div>
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
   return <div className="flex flex-row items-center gap-2 italic text-white text-sm md:text-xl">
      <span className="font-medium ">Te Conoceremos en </span>
      <div className="flex gap-2">
         <div>
            <span className="countdown font-mono ">
               <span style={{ "--value": 15 }}></span>
            </span>
            Dias
         </div>
         <div>
            <span className="countdown font-mono ">
               <span style={{ "--value": 10 }}></span>
            </span>
            Horas
         </div>
      </div>
   </div>
}


function TimeOfPregnant() {
   return <div className="flex flex-row items-center gap-2 italic text-white text-sm md:text-xl">
      <span className="font-medium ">Tienes </span>
      <div className="flex gap-2">
         <div>
            <span className="countdown font-mono ">
               <span style={{ "--value": 10 }}></span>
            </span>
            Semanas
         </div>
      </div>
   </div>
}