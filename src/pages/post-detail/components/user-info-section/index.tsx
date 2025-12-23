import { Avatar, Tag, theme } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { Post } from '@/types';
import { STATUS_CONFIG } from '../../constants/status-config';
import styles from './index.module.less';

interface UserInfoSectionProps {
  user: Post['user'];
  status?: Post['status'];
}

// 内联 PostStatusTag
function PostStatusTag({ status = 'pending' }: { status?: Post['status'] }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Tag icon={<Icon />} color={config.color}>
      {config.label}
    </Tag>
  );
}

export function UserInfoSection({ user, status }: UserInfoSectionProps) {
  const { token } = theme.useToken();

  return (
    <div className={styles.userSection}>
      <Avatar size={64} style={{ backgroundColor: token.colorPrimary }}>
        {user.nickname[0]?.toUpperCase()}
      </Avatar>
      <div className={styles.userInfo}>
        <div className={styles.nickname}>{user.nickname}</div>
        <div className={styles.userId}>
          <UserOutlined /> @{user.id}
        </div>
      </div>
      <div className={styles.statusWrapper}>
        <PostStatusTag status={status} />
      </div>
    </div>
  );
}
