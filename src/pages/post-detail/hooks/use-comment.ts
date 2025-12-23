import { useCallback, useState } from 'react';

import { getComments as getCommentsApi } from '../api';
import { moderateComment as moderateCommentApi } from '../api';
import { useCommentStore } from '../store/comment-store';

export function useComment() {
  const { list, total, statusCounts, setCommentData } = useCommentStore();
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isModerateLoading, setIsModerateLoading] = useState(false);

  const fetchComments = useCallback(async (postId: number) => {
    try {
      setIsFetchLoading(true);
      const response = await getCommentsApi({ postId });
      console.log('response', response);
      setCommentData({
        list: response.data.list || [],
        total: response.data.total || 0,
        statusCounts: response.data.statusCounts || {
          normal: 0,
          pending: 0,
          hidden: 0,
          deleted: 0,
        },
      });
    } catch {
      console.error('Failed to fetch comments');
    } finally {
      setIsFetchLoading(false);
    }
  }, []);

  const moderateComment = useCallback(
    async (postId: number, commentId: number, status: string) => {
      try {
        setIsModerateLoading(true);
        await moderateCommentApi({ postId, commentId, status });
        // Optimistic update could be done here, but fetching is safer for consistency
        fetchComments(postId);
      } catch {
        console.error('Failed to moderate comment');
      } finally {
        setIsModerateLoading(false);
      }
    },
    [fetchComments]
  ); // Added fetchComments dependency

  return {
    list,
    total,
    statusCounts,
    isFetchLoading,
    isModerateLoading,
    fetchComments,
    moderateComment,
  };
}
