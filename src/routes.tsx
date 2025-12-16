import { createBrowserRouter } from 'react-router-dom';

import Login from './pages/login';
import DashborardLayout from './components/dashborard-layout';

import { routes as childRoutes } from './pages/routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashborardLayout />,
    children: [...childRoutes],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
