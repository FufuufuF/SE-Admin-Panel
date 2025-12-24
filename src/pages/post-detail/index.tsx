import { useParams, useNavigate } from 'react-router-dom';
import { usePost, useModeratePost } from '@/hooks';
import { useMemo, useCallback, useEffect } from 'react';
import { Empty, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useComment } from './hooks/use-comment';
import { Comment } from './components/Comment';
import { UserInfoSection } from './components/user-info-section';
import { PostContentCard } from './components/post-content-card';
import { PostDetailInfo } from './components/post-detail-info';
import { ModerationActions } from './components/moderation-actions';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById } = usePost();
  const { loading, moderatePost } = useModeratePost();
  const { list, total, statusCounts, fetchComments } = useComment();

  const post = useMemo(() => {
    return getPostById(Number(id));
  }, [getPostById, id]);

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

  if (!post) {
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
          <Empty description="未找到该帖子" />
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
        <Comment list={list} total={total} statusCounts={statusCounts} />
        <ModerationActions onPass={handlePass} onReject={handleReject} loading={loading} />
      </div>
    </div>
  );
}
