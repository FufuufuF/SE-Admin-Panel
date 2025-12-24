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

  return (
    <div className={styles.mediaSection}>
      <Image.PreviewGroup>
        {media.map((item, index) => (
          <div key={index} className={styles.mediaWrapper}>
            {item.type === 'image' ? (
              <Image src={item.url} alt={`media-${index}`} className={styles.mediaImage} />
            ) : (
              <video src={item.url} controls className={styles.mediaVideo} />
            )}
          </div>
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
