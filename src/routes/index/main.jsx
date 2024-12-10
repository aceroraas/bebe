import { useState, useEffect } from 'react';
import NavigatorFixed from "../../shared/navigatorFixed";
import { getConfig, useConfigData } from "../../shared/services/getConfig";
// Importa aquí tus componentes que podrían ser renderizados

// ... otros componentes

export default function Main() {
   return <><NavigatorFixed /><SelectedComponent /></>
}


function SelectedComponent() {
   const { config, loading, error } = useConfigData();
   if (loading) return <div>Cargando...</div>;
   if (error) return <div>Error: {error.message}</div>;
   const mainPage = config?.find(conf => conf.item === 'mainPage')?.data;
   console.log(mainPage);
   if (mainPage) {
      let componente = mainPage.componente ?? false
      if (componente) {
         switch (componente) {
            case 'ComponenteA':
               return <h1>Componente A</h1>;
               break;
            case 'ComponenteB':
               return <h1>Componente B</h1>;
               break;
            default:
               return <h1>React Router main page</h1>;
         }
      }
   }
   return <h1>No se encontró la configuración</h1>;
}