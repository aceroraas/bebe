import { createRoot } from 'react-dom/client'
import './index.css'
import Main from './routes/index/main';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RevelationSex from './routes/revelation_sex';
import Config from './routes/config';
import Vote from './routes/vote/Vote';
import NavigatorFixed from './shared/navigatorFixed';

const router = createBrowserRouter([
  {
    path: "/",
    element: <> <NavigatorFixed /> <Main /></>,
  },
  {
    path: "/revelacion",
    element: <> <NavigatorFixed />  <RevelationSex /></>,
  },
  {
    path: "/nombres",
    element: <div>names!</div>,
  },
  {
    path: "/bebe",
    element: <div>baby Activity!</div>,
  },
  {
    path: "/descubrelo",
    element: <div>name Activity!</div>,
  },
  {
    path: "/configuracion",
    element: <> <NavigatorFixed /> <Config /></>,
  },
  {
    path: "/votacion",
    element: <> <NavigatorFixed /> <Vote /></>,
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
