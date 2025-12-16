import { Layout, Menu } from 'antd';
import { FileOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { DashboardOutlined } from '@ant-design/icons';
import { useCallback, useMemo, useState } from 'react';
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
    key: '/posts',
    label: '动态内容管理',
    icon: <FileOutlined />,
  },
  {
    key: '/settings',
    label: '敏感词设置',
    icon: <SettingOutlined />,
    children: [
      {
        key: '/settings/sensitive',
        label: '敏感词设置',
      },
    ],
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
      trigger={null} // 隐藏默认的底部触发器
      collapsible
      collapsed={collapsed}
      width={220}
      className={styles.sidebar}
    >
      {/* A. Logo 区域 */}
      <div className={styles.logo}>{collapsed ? 'Logo' : 'ADMIN'}</div>

      {/* B. 菜单组件 */}
      <Menu
        theme="dark" // 主题：dark 或 light
        mode="inline" // 模式：侧边栏必须用 inline
        // 核心数据源
        items={menuItems}
        // 核心交互：点击跳转
        onClick={handleMenuClick}
        // 核心交互：自动高亮
        selectedKeys={selectedKeys}
        // 初始展开的子菜单
        defaultOpenKeys={defaultOpenKeys}
      />
    </Sider>
  );
}
