import Users from './users';
import Moderate from './moderate';

export const routes = [
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '/moderate',
    element: <Moderate />,
  },
];
