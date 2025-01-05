import React from 'react';
import NavigatorFixed from '../navigatorFixed';
import Main from '../../routes/main';
import RevelationSex from '../../routes/revelation_sex';
import Config from '../../routes/config';
import Vote from '../../routes/vote/Vote';
import { ROUTES } from './routesConfig';

export function getRoutesWithElements() {
   return ROUTES.map(route => {
      let element;
      switch (route.path) {
         case "/":
            element = <> <NavigatorFixed /> <Main /></>;
            break;
         case "/revelacion":
            element = <> <NavigatorFixed /> <RevelationSex /></>;
            break;
         case "/nombres":
            element = <div>names!</div>;
            break;
         case "/bebe":
            element = <div>baby Activity!</div>;
            break;
         case "/descubrelo":
            element = <div>name Activity!</div>;
            break;
         case "/configuracion":
            element = <> <NavigatorFixed /> <Config /></>;
            break;
         case "/votacion":
            element = <> <NavigatorFixed /> <Vote /></>;
            break;
         default:
            element = <div>404 - Not Found</div>;
      }

      return {
         ...route,
         element
      };
   });
}

export { getRoutes, getNavigableRoutes, getRouteByPath, getRouteLabel } from './routesConfig';
