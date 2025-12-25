import { Layout, Button, Avatar, Space, Dropdown, theme, Badge } from 'antd';
import { UserOutlined, LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './index.module.less';

const { Header: AntHeader } = Layout;

export default function Header() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.replace('/login');
  };

  // 下拉菜单项
  const items: MenuProps['items'] = [
    {
      key: '3',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className={styles.header} style={{ background: colorBgContainer }}>
      {/* 左侧：占位或面包屑 */}
      <div className={styles.headerLeft}></div>

      {/* 右侧：功能按钮区 */}
      <Space size="middle">
        {/* 1. 帮助文档 */}
        <Button type="text" icon={<QuestionCircleOutlined />} style={{ fontSize: '16px' }} />

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
