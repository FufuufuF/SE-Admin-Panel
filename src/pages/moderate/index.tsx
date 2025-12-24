import { usePost } from '@/hooks';
import PostCard from './components/post-card';
import ModerateHeader from './components/header';
import { useEffect } from 'react';
import styles from './index.module.less';
import { theme } from 'antd';
import { getCssVars } from '@/utils/theme-utils';

export default function Moderate() {
  const { posts, fetchPosts } = usePost();
  const { token } = theme.useToken();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const cssVars = getCssVars(token);

  return (
    <div className={styles.container} style={cssVars}>
      <ModerateHeader />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
