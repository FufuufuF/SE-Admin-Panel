import Users from './users';
import Moderate from './moderate';
import PostDetail from './post-detail';
import Dashboard from './dashboard'

export const routes = [
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '/moderate',
    element: <Moderate />,
  },
  {
    path: '/moderate/:id',
    element: <PostDetail />,
  }
];

