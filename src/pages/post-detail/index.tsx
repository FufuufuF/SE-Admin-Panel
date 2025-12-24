import { useParams, useNavigate } from 'react-router-dom';
import { usePost, useModeratePost } from '@/hooks';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { Empty, Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useComment } from './hooks/use-comment';
import { Comment } from './components/comment';
import { UserInfoSection } from './components/user-info-section';
import { PostContentCard } from './components/post-content-card';
import { PostDetailInfo } from './components/post-detail-info';
import { ModerationActions } from './components/moderation-actions';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById, fetchPostById } = usePost();
  const { loading, moderatePost } = useModeratePost();
  const { list, total, statusCounts, fetchComments, moderateComment } = useComment();

  // 加载状态和错误状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从 store 中获取帖子
  const post = useMemo(() => {
    return getPostById(Number(id));
  }, [getPostById, id]);

  // 当 store 中没有帖子时，从 API 获取
  useEffect(() => {
    const postId = Number(id);
    if (!postId || isNaN(postId)) {
      setError('无效的帖子 ID');
      return;
    }

    // 如果 store 中已有该帖子，不需要再获取
    if (post) {
      return;
    }

    const loadPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchPostById(postId);
      } catch (err) {
        console.error('获取帖子失败:', err);
        setError('获取帖子失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id, post, fetchPostById]);

  // 获取评论
  useEffect(() => {
    if (post?.id) {
      fetchComments(post.id);
    }
  }, [post?.id, fetchComments]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handlePass = useCallback(() => {
    console.log('pass', post?.id);
    moderatePost(post!.id, 'normal');
  }, [post?.id, moderatePost]);

  const handleReject = useCallback(() => {
    console.log('reject', post?.id);
    moderatePost(post!.id, 'hidden');
  }, [post?.id, moderatePost]);

  const handleModerateComment = useCallback(
    (commentId: number, status: string) => {
      if (post?.id) {
        moderateComment(post.id, commentId, status);
      }
    },
    [post?.id, moderateComment]
  );

  // 加载中状态
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className={styles.backBtn}
          >
            返回
          </Button>
          <h1 className={styles.title}>帖子详情</h1>
        </div>
        <div className={styles.emptyContainer}>
          <Spin size="large" tip="加载中..." />
        </div>
      </div>
    );
  }

  // 错误状态或帖子不存在
  if (error || !post) {
    return (
      <div className={styles.container}>
        {/* 内联 PostHeader */}
        <div className={styles.header}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className={styles.backBtn}
          >
            返回
          </Button>
          <h1 className={styles.title}>帖子详情</h1>
        </div>
        <div className={styles.emptyContainer}>
          <Empty description={error || '未找到该帖子'} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 内联 PostHeader */}
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className={styles.backBtn}
        >
          返回
        </Button>
        <h1 className={styles.title}>帖子详情</h1>
      </div>
      <div className={styles.content}>
        <UserInfoSection user={post.user} status={post.status} />
        <PostContentCard text={post.text} media={post.media} tags={post.tags} stats={post.stats} />
        <PostDetailInfo post={post} />
        <Comment
          list={list}
          total={total}
          statusCounts={statusCounts}
          onModerate={handleModerateComment}
        />
        <ModerationActions onPass={handlePass} onReject={handleReject} loading={loading} />
      </div>
    </div>
  );
}
