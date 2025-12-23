import { Card, Descriptions, Tag } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { Post } from '@/types';
import styles from './index.module.less';

interface PostDetailInfoProps {
  post: Post;
}

export function PostDetailInfo({ post }: PostDetailInfoProps) {
  const mediaCount = post.media?.length || 0;

  return (
    <Card title="详细信息" className={styles.detailCard}>
      <Descriptions column={1}>
        <Descriptions.Item
          label={
            <span>
              <CalendarOutlined /> 发布时间
            </span>
          }
        >
          {new Date(post.createdAt).toLocaleString('zh-CN')}
        </Descriptions.Item>
        <Descriptions.Item label="帖子ID">{post.id}</Descriptions.Item>
        <Descriptions.Item label="用户ID">{post.user.id}</Descriptions.Item>
        <Descriptions.Item label="可见性">
          {post.visibility === 'public' ? (
            <Tag color="green">公开</Tag>
          ) : (
            <Tag color="orange">私密</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="媒体数量">{mediaCount} 个</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
