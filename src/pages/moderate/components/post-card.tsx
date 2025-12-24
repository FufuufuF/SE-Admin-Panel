import { Avatar, Image, theme, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Post } from '@/types';
import styles from './index.module.less';
import { getCssVars } from '@/utils/theme-utils';

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModeratePost } from '@/hooks';

export interface PostCardProps {
  post: Post;
}

export default React.memo(function PostCard({ post }: PostCardProps) {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const { moderatePost, loading } = useModeratePost();

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
          <div className={styles.mediaGrid}>
            <Image.PreviewGroup>
              {post.media.slice(0, 3).map((m, index) => {
                const isLast = index === 2;
                const remaining = mediaCount - 3;
                const showOverlay = isLast && remaining > 0;

                return (
                  <div key={index} className={styles.mediaItemWrapper}>
                    <Image
                      src={m.url}
                      className={styles.mediaItem}
                      rootClassName={styles.mediaItem}
                      preview={{ visible: false }}
                      onClick={() => {
                        // Handle click to open preview?
                        // Antd Image component handles preview by default if inside PreviewGroup.
                        // But with overlay we might need to be careful.
                        // Actually standard behavior works fine, just visually we cover it.
                      }}
                    />
                    {showOverlay && (
                      <div
                        className={styles.moreOverlay}
                        onClick={() => {
                          // Propagate click to image or handle preview open
                          // To trigger preview of the clicked image, we rely on the implementation.
                          // However, if strict control is needed, we rely on Antd Image.
                        }}
                      >
                        +{remaining}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Hidden images for preview group */}
              {post.media.slice(3).map((m, index) => (
                <Image key={`hidden-${index}`} src={m.url} style={{ display: 'none' }} />
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
