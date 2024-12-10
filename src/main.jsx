import { createRoot } from 'react-dom/client'
import './index.css'
import Main from './routes/index/main';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/revelacion",
    element: <div>revelation</div>,
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
    element: <div>configuracion Activity!</div>,
  },
  {
    path: "/votacion",
    element: <div>votacion Activity!</div>,
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
