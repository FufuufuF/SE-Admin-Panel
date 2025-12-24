import { usePost } from '@/hooks';
import PostCard from './components/post-card';
import ModerateHeader from './components/header';
import { useCallback, useEffect } from 'react';
import styles from './index.module.less';
import { theme } from 'antd';
import { InfiniteScrollList } from '@/components/infinite-scroll-list';
import { getCssVars } from '@/utils/theme-utils';

export default function Moderate() {
  const { filteredPosts, fetchMorePosts, clearPosts, resetFilters } = usePost();
  const { token } = theme.useToken();

  // 组件挂载时清空之前的帖子，确保干净的分页状态
  useEffect(() => {
    clearPosts();
    resetFilters();
  }, [clearPosts, resetFilters]);

  const loadList = useCallback(
    async (page: number, pageSize: number, status?: string) => {
      try {
        // 使用 fetchMorePosts 进行增量加载
        const result = await fetchMorePosts(page, pageSize, status);
        return result || { list: [], total: 0 };
      } catch (error) {
        console.error(error);
        return { list: [], total: 0 };
      }
    },
    [fetchMorePosts]
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
        items={filteredPosts}
      />
    </div>
  );
}
