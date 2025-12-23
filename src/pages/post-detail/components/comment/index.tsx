import React from 'react';
import { List, Avatar, Tag, Card, Empty, Space, Button, Dropdown } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  DownOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

import styles from './index.module.less';
import type { CommentItem, StatusCounts } from './types';

export interface CommentProps {
  total: number;
  list: CommentItem[];
  statusCounts: StatusCounts;
  onModerate: (commentId: number, status: string) => void;
}

export const Comment = React.memo(function Comment({
  total,
  list,
  statusCounts,
  onModerate,
}: CommentProps) {
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

  const statusItems: MenuProps['items'] = [
    {
      key: 'normal',
      label: '正常',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    },
    {
      key: 'pending',
      label: '待审核',
      icon: <ClockCircleOutlined style={{ color: '#faad14' }} />,
    },
    {
      key: 'hidden',
      label: '隐藏',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    },
    {
      key: 'deleted',
      label: '删除',
      icon: <DeleteOutlined />,
    },
  ];

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
            <span className={styles.value} style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
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
              <div
                className={styles.footer}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ color: '#ccc', fontSize: '12px' }}>ID: {item.id}</span>
                <Dropdown
                  menu={{
                    items: statusItems,
                    onClick: ({ key }) => onModerate(item.id, key),
                  }}
                >
                  <Button type="link" size="small" icon={<SafetyCertificateOutlined />}>
                    审核 <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
});
