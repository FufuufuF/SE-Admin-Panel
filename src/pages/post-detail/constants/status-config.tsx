import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Post } from '@/types';

export const STATUS_CONFIG: Record<
  NonNullable<Post['status']>,
  {
    icon: React.ComponentType;
    color: 'success' | 'error' | 'warning';
    label: string;
  }
> = {
  normal: {
    icon: CheckCircleOutlined,
    color: 'success',
    label: '已通过',
  },
  hidden: {
    icon: CloseCircleOutlined,
    color: 'error',
    label: '未通过',
  },
  pending: {
    icon: ClockCircleOutlined,
    color: 'warning',
    label: '待审核',
  },
  deleted: {
    icon: CloseCircleOutlined,
    color: 'error',
    label: '已删除',
  },
};
