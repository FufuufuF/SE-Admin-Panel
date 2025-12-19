import { useParams, useNavigate } from "react-router-dom";
import { usePost } from "@/hooks";
import { useMemo, useCallback } from "react";
import { Avatar, Image, Button, Descriptions, Tag, Space, theme, Empty, Card, Statistic } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  CommentOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { getCssVars } from '@/utils/theme-utils';
import styles from './index.module.less';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById } = usePost();
  const { token } = theme.useToken();

  const post = useMemo(() => {
    return getPostById(Number(id));
  }, [getPostById, id]);

  const cssVars = getCssVars(token);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handlePass = useCallback(() => {
    console.log('pass', post?.id);
    // TODO: 调用审核通过API
  }, [post?.id]);

  const handleReject = useCallback(() => {
    console.log('reject', post?.id);
    // TODO: 调用审核拒绝API
  }, [post?.id]);

  const renderStatus = () => {
    const status = post?.status || 'pending';

    switch (status) {
      case 'normal':
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已通过
          </Tag>
        );
      case 'hidden':
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            未通过
          </Tag>
        );
      case 'pending':
      default:
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            待审核
          </Tag>
        );
    }
  };

  if (!post) {
    return (
      <div className={styles.container} style={cssVars}>
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

  const mediaCount = post.media?.length || 0;

  return (
    <div className={styles.container} style={cssVars}>
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
        {/* 用户信息区域 */}
        <div className={styles.userSection}>
          <Avatar 
            size={64} 
            style={{ backgroundColor: token.colorPrimary }}
          >
            {post.user.nickname[0]?.toUpperCase()}
          </Avatar>
          <div className={styles.userInfo}>
            <div className={styles.nickname}>{post.user.nickname}</div>
            <div className={styles.userId}>
              <UserOutlined /> @{post.user.id}
            </div>
          </div>
          <div className={styles.statusWrapper}>
            {renderStatus()}
          </div>
        </div>

        {/* 帖子内容 */}
        <Card className={styles.postCard} bordered={false}>
          <div className={styles.postText}>{post.text}</div>

          {/* 媒体内容 */}
          {mediaCount > 0 && (
            <div className={styles.mediaSection}>
              <Image.PreviewGroup>
                {post.media.map((media, index) => (
                  <div key={index} className={styles.mediaWrapper}>
                    {media.type === 'image' ? (
                      <Image
                        src={media.url}
                        alt={`media-${index}`}
                        className={styles.mediaImage}
                      />
                    ) : (
                      <video 
                        src={media.url} 
                        controls 
                        className={styles.mediaVideo}
                      />
                    )}
                  </div>
                ))}
              </Image.PreviewGroup>
            </div>
          )}

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsSection}>
              {post.tags.map((tag, index) => (
                <Tag key={index} color="blue">
                  #{tag}
                </Tag>
              ))}
            </div>
          )}

          {/* 统计信息 */}
          <div className={styles.statsSection}>
            <Space size="large">
              <Statistic
                title="评论数"
                value={post.stats.commentCount}
                prefix={<CommentOutlined />}
              />
              <Statistic
                title="平均评分"
                value={post.stats.avgScore}
                precision={1}
                prefix={<StarOutlined />}
              />
              <Statistic
                title="评分人数"
                value={post.stats.scoreCount}
              />
            </Space>
          </div>
        </Card>

        {/* 详细信息 */}
        <Card title="详细信息" className={styles.detailCard}>
          <Descriptions column={1}>
            <Descriptions.Item 
              label={<span><CalendarOutlined /> 发布时间</span>}
            >
              {new Date(post.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="帖子ID">
              {post.id}
            </Descriptions.Item>
            <Descriptions.Item label="用户ID">
              {post.user.id}
            </Descriptions.Item>
            <Descriptions.Item label="可见性">
              {post.visibility === 'public' ? (
                <Tag color="green">公开</Tag>
              ) : (
                <Tag color="orange">私密</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="媒体数量">
              {mediaCount} 个
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 审核操作区域 */}
        <div className={styles.actionSection}>
          <Button
            size="large"
            danger
            icon={<CloseCircleOutlined />}
            onClick={handleReject}
            className={styles.rejectBtn}
          >
            审核不通过
          </Button>
          <Button
            size="large"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handlePass}
            className={styles.passBtn}
          >
            审核通过
          </Button>
        </div>
      </div>
    </div>
  );
}
