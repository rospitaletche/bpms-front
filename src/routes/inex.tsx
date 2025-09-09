import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import VerificationPage from '../pages/VerificationPage'; // 1. Importa la nueva página

const router = createBrowserRouter([
  {
    path: '/',
    element: <VerificationPage />, // 2. Úsala como la ruta principal
  },
  // Podemos reactivar la StyleGuide más adelante si la necesitamos
  // { 
  //   path: '/style-guide',
  //   element: <StyleGuidePage />,
  // },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

