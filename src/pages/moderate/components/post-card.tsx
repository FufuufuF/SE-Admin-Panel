import { Avatar, Image, theme, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Post } from '@/types';
import styles from './index.module.less';
import { getCssVars } from '@/utils/theme-utils';

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModerate } from '@/hooks';

export interface PostCardProps {
  post: Post;
}

export default React.memo(function PostCard({ post }: PostCardProps) {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const { moderatePost, loading } = useModerate();

  const handlePass = useCallback(() => {
    moderatePost(post.id, 'normal');
  }, [moderatePost, post.id]);

  const handleFail = useCallback(() => {
    moderatePost(post.id, 'hidden');
  }, [moderatePost, post.id]);

  const handleCardClick = useCallback(() => {
    navigate(`/moderate/${post.id}`);
  }, [navigate, post.id]);

  // 使用公共工具函数获取 CSS 变量
  // 如果该组件需要特定的额外变量，可以在此扩展
  const cssVars = getCssVars(token);

  const mediaCount = post.media?.length || 0;

  // Simple grid layout logic for preview
  const getGridStyle = () => {
    if (mediaCount === 1) return { gridTemplateColumns: '1fr' };
    return { gridTemplateColumns: '1fr 1fr' };
  };

  const renderStatus = () => {
    const status = post.status || 'pending'; // Default to pending if not set

    switch (status) {
      case 'normal':
        return (
          <div className={`${styles.statusBadge} ${styles.passed}`}>
            <CheckCircleOutlined style={{ marginRight: 4 }} />
            已通过
          </div>
        );
      case 'hidden':
        return (
          <div className={`${styles.statusBadge} ${styles.failed}`}>
            <CloseCircleOutlined style={{ marginRight: 4 }} />
            未通过
          </div>
        );
      case 'pending':
      default:
        return (
          <div className={`${styles.statusBadge} ${styles.pending}`}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            待审核
          </div>
        );
    }
  };

  return (
    <div className={styles.card} style={cssVars} onClick={handleCardClick}>
      <div className={styles.avatarCol}>
        <Avatar style={{ backgroundColor: token.colorPrimary, verticalAlign: 'middle' }} size={40}>
          {post.user.nickname[0]?.toUpperCase()}
        </Avatar>
      </div>
      <div className={styles.contentCol}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <span className={styles.nickname}>{post.user.nickname}</span>
            <span className={styles.meta}>
              @{post.user.id} · {new Date(post.createdAt).toLocaleDateString()}
            </span>
            {renderStatus()}
          </div>
        </div>

        <div className={styles.text}>{post.text}</div>

        {mediaCount > 0 && (
          <div className={styles.mediaGrid} style={getGridStyle()}>
            <Image.PreviewGroup>
              {post.media.map((m, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: mediaCount === 1 ? '0' : '100%',
                    height: mediaCount === 1 ? 'auto' : 0,
                  }}
                >
                  <Image
                    src={m.url}
                    className={styles.mediaItem}
                    wrapperStyle={{
                      position: mediaCount === 1 ? 'static' : 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'block',
                    }}
                    style={{
                      height: mediaCount === 1 ? 'auto' : '100%',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </Image.PreviewGroup>
          </div>
        )}

        <div className={styles.auditActions}>
          <Button
            danger
            loading={loading}
            icon={<CloseCircleOutlined />}
            className={styles.auditBtn}
            onClick={(e) => {
              e.stopPropagation();
              handleFail();
            }}
          >
            不通过
          </Button>
          <Button
            type="primary"
            loading={loading}
            icon={<CheckCircleOutlined />}
            className={styles.auditBtn}
            onClick={(e) => {
              e.stopPropagation();
              handlePass();
            }}
          >
            通过
          </Button>
        </div>
      </div>
    </div>
  );
});
