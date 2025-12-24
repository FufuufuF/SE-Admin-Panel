import { Card, Image, Tag, Space, Statistic } from 'antd';
import { CommentOutlined, StarOutlined } from '@ant-design/icons';
import type { Post } from '@/types';
import styles from './index.module.less';

interface PostContentCardProps {
  text: string;
  media: Post['media'];
  tags: string[];
  stats: Post['stats'];
}

// 内联 MediaGallery
function MediaGallery({ media }: { media: Post['media'] }) {
  if (!media || media.length === 0) {
    return null;
  }

  const getGridClass = (count: number) => {
    switch (count) {
      case 1:
        return styles['grid-1'];
      case 2:
        return styles['grid-2'];
      case 3:
        return styles['grid-3'];
      case 4:
        return styles['grid-4'];
      default:
        // For 5-9 items, use the multi-grid (3 cols)
        return styles['grid-multi'];
    }
  };

  const placeholder = (
    <div className={styles.placeholder}>
      <div style={{ padding: 20 }}>Loading...</div>
    </div>
  );

  const MAX_DISPLAY = 9;
  const displayMedia = media.slice(0, MAX_DISPLAY);
  const remaining = media.length - MAX_DISPLAY;

  return (
    <div className={`${styles.mediaSection} ${getGridClass(displayMedia.length)}`}>
      <Image.PreviewGroup>
        {displayMedia.map((item, index) => {
          const isLast = index === displayMedia.length - 1;
          // If we have remaining items and this is the last visible block, show overlay
          // Wait, usually if we have 10 items, we show 9. The 9th item (index 8) shows +1.
          // Yes, that is the standard pattern.
          const showOverlay = isLast && remaining > 0;

          return (
            <div key={index} className={styles.mediaWrapper}>
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={`media-${index}`}
                  className={styles.mediaImage}
                  placeholder={placeholder}
                  fallback="https://via.placeholder.com/400x300?text=Load+Failed"
                  preview={{ visible: false }} // Rely on group, but we might want to trigger it manually if overlay blocks it?
                  // Actually Antd Image click works even with overlay if overlay has pointer-events: none.
                  // But wait, if overly has pointer-events: none, then the click goes to the image, which is fine.
                  // BUT, overlay text " +N " will be visible.
                />
              ) : (
                <video src={item.url} controls className={styles.mediaVideo} />
              )}
              {showOverlay && <div className={styles.moreOverlay}>+{remaining}</div>}
            </div>
          );
        })}

        {/* Hidden items for gallery */}
        {media.slice(MAX_DISPLAY).map((item, index) => (
          <Image key={`hidden-${index}`} src={item.url} style={{ display: 'none' }} />
        ))}
      </Image.PreviewGroup>
    </div>
  );
}

// 内联 TagList
function TagList({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.tagsSection}>
      {tags.map((tag, index) => (
        <Tag key={index} color="blue">
          #{tag}
        </Tag>
      ))}
    </div>
  );
}

// 内联 PostStats
function PostStats({ stats }: { stats: Post['stats'] }) {
  return (
    <div className={styles.statsSection}>
      <Space size="large">
        <Statistic title="评论数" value={stats.commentCount} prefix={<CommentOutlined />} />
        <Statistic
          title="平均评分"
          value={stats.avgScore}
          precision={1}
          prefix={<StarOutlined />}
        />
        <Statistic title="评分人数" value={stats.scoreCount} />
      </Space>
    </div>
  );
}

export function PostContentCard({ text, media, tags, stats }: PostContentCardProps) {
  return (
    <Card className={styles.postCard} bordered={false}>
      <div className={styles.postText}>{text}</div>
      <MediaGallery media={media} />
      <TagList tags={tags} />
      <PostStats stats={stats} />
    </Card>
  );
}
