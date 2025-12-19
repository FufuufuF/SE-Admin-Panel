import Users from './users';
import Moderate from './moderate';
import PostDetail from './post-detail';

export const routes = [
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
