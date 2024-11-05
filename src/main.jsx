import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/h2",
    element: <div>h2!</div>,
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
