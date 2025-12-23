import React from 'react';
import { List, Avatar, Tag, Card, Empty, Space } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  MessageOutlined,
} from '@ant-design/icons';

import styles from './comment.module.less';
import type { CommentItem, StatusCounts } from './types';

export interface CommentProps {
  total: number;
  list: CommentItem[];
  statusCounts: StatusCounts;
}

export const Comment = React.memo(function Comment({ total, list, statusCounts }: CommentProps) {
  if (!list || total === 0) {
    return <Empty description="暂无评论数据" />;
  }

  const renderStatusTag = (status: CommentItem['status']) => {
    switch (status) {
      case 'normal':
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            正常
          </Tag>
        );
      case 'pending':
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            待审核
          </Tag>
        );
      case 'hidden':
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            隐藏
          </Tag>
        );
      case 'deleted':
        return (
          <Tag icon={<DeleteOutlined />} color="default">
            已删除
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <div className={styles.container}>
      {/* 状态统计 */}
      <Card className={styles.statsCard} bordered={false}>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.label}>全部评论</span>
            <span className={styles.value}>{total}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>正常</span>
            <span className={styles.value} style={{ color: '#52c41a' }}>
              {statusCounts.normal || 0}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>待审核</span>
            <span className={styles.value} style={{ color: '#faad14' }}>
              {statusCounts.pending || 0}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>隐藏</span>
            <span className={styles.value} style={{ color: '#ff4d4f' }}>
              {statusCounts.hidden || 0}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>删除</span>
            <span className={styles.value} style={{ color: '#00000040' }}>
              {statusCounts.deleted || 0}
            </span>
          </div>
        </div>
      </Card>

      {/* 评论列表 */}
      <Card
        title={
          <Space>
            <MessageOutlined />
            <span>评论列表</span>
          </Space>
        }
        className={styles.listCard}
        bordered={false}
      >
        <List
          itemLayout="vertical"
          dataSource={list}
          renderItem={(item) => (
            <List.Item key={item.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <div className={styles.userInfo}>
                  <Avatar icon={<UserOutlined />} size="small" />
                  <span className={styles.nickname}>{item.user.nickname}</span>
                  <span className={styles.time}>{item.createdAt}</span>
                </div>
                <div>{renderStatusTag(item.status)}</div>
              </div>
              <div className={styles.content}>{item.content}</div>
              <div className={styles.footer}>
                <span style={{ color: '#999', fontSize: '12px' }}>ID: {item.id}</span>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
});
