import { Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';

interface ModerationActionsProps {
  onPass: () => void;
  onReject: () => void;
  loading: boolean;
}

export function ModerationActions({ onPass, onReject, loading }: ModerationActionsProps) {
  return (
    <div className={styles.actionSection}>
      <Button
        size="large"
        danger
        icon={<CloseCircleOutlined />}
        onClick={onReject}
        loading={loading}
        className={styles.rejectBtn}
      >
        审核不通过
      </Button>
      <Button
        size="large"
        type="primary"
        icon={<CheckCircleOutlined />}
        onClick={onPass}
        loading={loading}
        className={styles.passBtn}
      >
        审核通过
      </Button>
    </div>
  );
}
