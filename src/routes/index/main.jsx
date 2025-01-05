import { useConfigData } from "../../shared/services/getConfig";
// Importa aquí tus componentes que podrían ser renderizados

// ... otros componentes

export default function Main() {
   return <><SelectedComponent /></>
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
            case 'revelacion':
               return <RevelationSex />;
            case 'votacion':
               return <Vote />;
            default:
               return <h1>React Router main page</h1>;
         }
      }
   }
   return <h1>No se encontró la configuración</h1>;
}