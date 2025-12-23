import { usePost } from '@/hooks';
import PostCard from './components/post-card';
import ModerateHeader from './components/header';
import { useCallback, useEffect } from 'react';
import styles from './index.module.less';
import { theme } from 'antd';
import { InfiniteScrollList } from '@/components/infinite-scroll-list';
import { getCssVars } from '@/utils/theme-utils';

export default function Moderate() {
  const { posts, fetchPosts } = usePost();
  const { token } = theme.useToken();

  const loadList = useCallback(
    async (page: number, pageSize: number, status?: string) => {
      try {
        const result = await fetchPosts(page, pageSize, status);
        return result || { list: [], total: 0 };
      } catch (error) {
        console.error(error);
        return { list: [], total: 0 };
      }
    },
    [fetchPosts]
  );

  const cssVars = getCssVars(token);

  return (
    <div className={styles.container} style={cssVars}>
      <ModerateHeader />
      <InfiniteScrollList
        fetchData={loadList}
        renderItem={(post) => <PostCard key={post.id} post={post} />}
        loadingComponent={<div style={{ textAlign: 'center', padding: 10 }}>加载中...</div>}
        endComponent={<div style={{ textAlign: 'center', padding: 10 }}>没有更多了</div>}
        emptyComponent={<div style={{ textAlign: 'center', padding: 10 }}>暂无数据</div>}
        items={posts}
      />
    </div>
  );
}
