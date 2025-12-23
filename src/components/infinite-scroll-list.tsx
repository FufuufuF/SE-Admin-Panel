import { useCallback, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export interface InfiniteScrollListProps {
  fetchData: (page: number, pageSize: number) => Promise<{ list: any[]; total: number }>;
  renderItem: (item: any, _id?: number) => React.ReactNode;
  loadingComponent: React.ReactNode;
  endComponent: React.ReactNode;
  emptyComponent: React.ReactNode;
  pageSize?: number;
}

export function InfiniteScrollList({
  fetchData,
  renderItem,
  loadingComponent,
  endComponent,
  emptyComponent,
  pageSize = 10,
}: InfiniteScrollListProps) {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchData(page, pageSize);
      const newList = result.list || [];

      setItems((prevItems) => [...prevItems, ...newList]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
      setHasMore(newList.length >= pageSize);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchData, pageSize]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [loadMore, inView]);

  return (
    <div>
      {items.map((item, _id) => renderItem(item, _id))}
      {items.length === 0 && emptyComponent}
      <div ref={ref}>
        {loading && loadingComponent}
        {!hasMore && endComponent}
      </div>
    </div>
  );
}
