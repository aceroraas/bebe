import React from 'react';
import NavigatorFixed from '../navigatorFixed';
import Main from '../../routes/main';
import RevelationSex from '../../routes/revelation_sex';
import Config from '../../routes/config';
import Vote from '../../routes/votacion';
import { ROUTES } from './routesConfig';
import NamesByUsers from '../../routes/names_by_users';
import Descubrelo from '../../routes/descubrelo';
import BabyChat from '../../routes/baby_chat';

// Componente contenedor que agrega el NavigatorFixed
const WithNavigator = ({ children }) => (
   <>
      <NavigatorFixed />
      {children}
   </>
);

// Componentes de página con sus respectivos placeholders
const PAGE_COMPONENTS = {
   '/': <Main />,
   '/revelacion': <RevelationSex />,
   '/nombres': <NamesByUsers />,
   '/bebe': <BabyChat />,
   '/descubrelo': <Descubrelo />,
   '/configuracion': <Config />,
   '/votacion': <Vote />,
};

// Componente para páginas no encontradas
const NotFound = () => (
   <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
         <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
         <p className="text-xl text-gray-600">Página no encontrada</p>
      </div>
   </div>
);

export function getRoutesWithElements() {
   return ROUTES.map(route => ({
      ...route,
      element: (
         <WithNavigator>
            {PAGE_COMPONENTS[route.path] || <NotFound />}
         </WithNavigator>
      )
   }));
}

export { getRoutes, getNavigableRoutes, getRouteByPath, getRouteLabel } from './routesConfig';
