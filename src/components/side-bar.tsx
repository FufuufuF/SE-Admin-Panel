import { Layout, Menu } from 'antd';
import { FileOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { DashboardOutlined } from '@ant-design/icons';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.less';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/users',
    label: '用户管理',
    icon: <UserOutlined />,
  },
  {
    key: '/dashboard',
    label: '数据仪表盘',
    icon: <DashboardOutlined />,
  },
  {
    key: '/moderate',
    label: '动态内容管理',
    icon: <FileOutlined />,
  },
];

interface SideBarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export default function SideBar({ collapsed, onCollapse }: SideBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = useCallback(
    (e: { key: string }) => {
      navigate(e.key);
    },
    [navigate]
  );

  const selectedKeys = useMemo(() => {
    return [location.pathname];
  }, [location.pathname]);

  const defaultOpenKeys = useMemo(() => {
    return [location.pathname.split('/')[1]];
  }, [location.pathname]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={220}
      collapsedWidth={80}
      breakpoint="lg"
      onCollapse={onCollapse}
      className={styles.sidebar}
    >
      <div className={styles.sidebarContent}>
        {/* A. Logo 区域 */}
        <div className={styles.logo}>{collapsed ? 'Logo' : 'ADMIN'}</div>

        {/* B. 菜单组件 */}
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          style={{ border: 'none' }}
        />
      </div>
    </Sider>
  );
}
