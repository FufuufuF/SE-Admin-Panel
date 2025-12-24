import { createBrowserRouter } from 'react-router-dom';

import Login from './pages/login';
import DashborardLayout from './components/dashborard-layout';

import { routes as childRoutes } from './pages/routes';
import Dashboard from './pages/dashboard';

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <DashborardLayout />,
//     children: [...childRoutes],
//   },
//   {
//     path: '/login',
//     element: <Login />,
//   },
// ]);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashborardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />, // 默认跳转到仪表盘
      },
      ...childRoutes,
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
])
