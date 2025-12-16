import { Layout, Button, Avatar, Space, Dropdown, theme, Badge } from 'antd';
import {
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './index.module.less';

const { Header: AntHeader } = Layout;

export default function Header() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 下拉菜单项
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '个人中心',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: '系统设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <AntHeader className={styles.header} style={{ background: colorBgContainer }}>
      {/* 左侧：折叠按钮 */}
      {/* <Button
        type="text"
        className={styles.headerLeft}
      /> */}
      <div></div>

      {/* 右侧：功能按钮区 */}
      <Space size="middle">
        {/* 1. 帮助文档 */}
        <Button type="text" icon={<QuestionCircleOutlined />} style={{ fontSize: '16px' }} />

        {/* 2. 消息通知 */}
        <Badge count={5} size="small">
          <Button type="text" icon={<BellOutlined />} style={{ fontSize: '16px' }} />
        </Badge>

        {/* 3. 用户头像下拉 */}
        <Dropdown menu={{ items }}>
          <Space className={styles.headerRight}>
            <Avatar className={styles.avatar} icon={<UserOutlined />} />
            <span style={{ fontSize: '14px' }}>Admin User</span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
