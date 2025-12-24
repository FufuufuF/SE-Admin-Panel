import { useCallback, useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

export interface InfiniteScrollListProps {
  fetchData: (
    page: number,
    pageSize: number,
    status?: string
  ) => Promise<{ list: any[]; total: number }>;
  renderItem: (item: any, _id?: number) => React.ReactNode;
  loadingComponent: React.ReactNode;
  endComponent: React.ReactNode;
  emptyComponent: React.ReactNode;
  pageSize?: number;
  status?: string;
  items?: any[];
}

export function InfiniteScrollList({
  fetchData,
  renderItem,
  status,
  pageSize = 5,
  loadingComponent,
  endComponent,
  emptyComponent,
  items: externalItems,
}: InfiniteScrollListProps) {
  const [internalItems, setInternalItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 使用 ref 存储可变状态，避免闭包问题
  const stateRef = useRef({
    loading: false,
    page: 1,
    hasMore: true,
  });

  // 追踪上一次的 inView 状态，用于检测边缘触发
  const prevInViewRef = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const items = externalItems || internalItems;

  const loadMore = useCallback(async () => {
    // 使用 ref 中的状态进行检查
    if (stateRef.current.loading || !stateRef.current.hasMore) return;

    stateRef.current.loading = true;
    setLoading(true);

    try {
      const currentPage = stateRef.current.page;
      const result = await fetchData(currentPage, pageSize, status);
      const newList = result.list || [];

      if (!externalItems) {
        setInternalItems((prevItems) => [...prevItems, ...newList]);
      }

      const newHasMore = newList.length >= pageSize;
      stateRef.current.page = currentPage + 1;
      stateRef.current.hasMore = newHasMore;

      setHasMore(newHasMore);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      stateRef.current.loading = false;
    }
  }, [fetchData, pageSize, status, externalItems]);

  // 首次加载
  useEffect(() => {
    loadMore();
  }, []);

  // 监听 inView 变化，只在从 false -> true 时触发
  useEffect(() => {
    const wasInView = prevInViewRef.current;
    prevInViewRef.current = inView;

    // 只有当 inView 从 false 变成 true 时才触发加载
    if (!wasInView && inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <div>
      {items.map((item, _id) => renderItem(item, _id))}
      {items.length === 0 && !loading && emptyComponent}
      <div ref={ref} style={{ minHeight: 1 }}>
        {loading && loadingComponent}
        {!hasMore && items.length > 0 && endComponent}
      </div>
    </div>
  );
}
