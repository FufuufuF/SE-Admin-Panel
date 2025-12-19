import { useCallback, useState } from 'react';

import { type ModerateRequest } from '@/api/moderate';
import { usePost } from '@/hooks';
import { moderatePost as moderatePostApi } from '@/api/moderate';

export function useModerate() {
  const { setPostById } = usePost();
  const [loading, setLoading] = useState(false);

  const moderatePost = useCallback(
    async (postId: number, moderateRequest: ModerateRequest['status']) => {
      try {
        setLoading(true);
        await moderatePostApi({
          postId,
          request: {
            status: moderateRequest,
          },
        });
        setPostById(postId, { status: moderateRequest });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [setPostById]
  );

  return {
    loading,
    moderatePost,
  };
}
