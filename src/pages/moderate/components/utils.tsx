import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';

export interface OnMenuItemClickProps {
  onPass: () => void;
  onFail: () => void;
}

export const getMenuItems = (props: OnMenuItemClickProps) => {
  return [
    {
      key: 'pass',
      label: '通过',
      icon: <CheckCircleOutlined />,
      onClick: props.onPass,
    },
    {
      key: 'fail',
      label: '不通过',
      icon: <DeleteOutlined />,
      onClick: props.onFail,
    },
  ];
};
