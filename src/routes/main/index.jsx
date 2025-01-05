import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNavigableRoutes } from '../../shared/services/routesConfig';
import { NextStepCard } from '../../shared/components/NextStepCard';

const routes = getNavigableRoutes();

export default function Main() {
   const navigate = useNavigate();
   const [selectedRoute, setSelectedRoute] = useState('/');

   const handleRouteChange = (event) => {
      const newRoute = event.target.value;
      setSelectedRoute(newRoute);
      navigate(newRoute);
   };

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
         <div className="max-w-4xl mx-auto space-y-6">
            {/* Card Principal */}
            <div className="card bg-base-100 shadow-xl">
               <div className="card-body">
                  <h2 className="card-title text-3xl mb-8">Bienvenido a Baby App</h2>
                  
                  <div className="form-control w-full max-w-md mx-auto">
                     <label className="label">
                        <span className="label-text text-xl">¿A dónde quieres ir?</span>
                     </label>
                     <select 
                        className="select select-lg select-bordered w-full text-lg"
                        value={selectedRoute}
                        onChange={handleRouteChange}
                     >
                        {routes.map(route => (
                           <option key={route.path} value={route.path}>
                              {route.icon} {route.label}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="mt-8 text-center text-gray-600">
                     <p className="text-lg">
                        Selecciona una opción para navegar a la sección deseada
                     </p>
                  </div>
               </div>
            </div>

            {/* Llamado a la Acción */}
            <NextStepCard />
         </div>
      </div>
   );
}
