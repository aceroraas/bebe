export const ROUTES = [
   { 
      path: "/", 
      label: "Página Principal",
      showInNav: true,
      icon: "🏠"
   },
   { 
      path: "/revelacion", 
      label: "Revelación de Género",
      showInNav: true,
      icon: "👶"
   },
   { 
      path: "/nombres", 
      label: "Nombres",
      showInNav: true,
      icon: "📝"
   },
   { 
      path: "/bebe", 
      label: "Actividad del Bebé",
      showInNav: true,
      icon: "🎯"
   },
   { 
      path: "/descubrelo", 
      label: "Descubre el Nombre",
      showInNav: true,
      icon: "🔍"
   },
   { 
      path: "/configuracion", 
      label: "Configuración",
      showInNav: true,
      icon: "⚙️"
   },
   { 
      path: "/votacion", 
      label: "Votación",
      showInNav: true,
      icon: "✍️"
   },
];

export function getRoutes() {
   return ROUTES;
}

export function getNavigableRoutes() {
   return ROUTES.filter(route => route.showInNav);
}

export function getRouteByPath(path) {
   return ROUTES.find(route => route.path === path);
}

export function getRouteLabel(path) {
   const route = getRouteByPath(path);
   return route ? route.label : '';
}
