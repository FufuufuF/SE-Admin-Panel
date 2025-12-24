import { Layout, Button, Avatar, Space, Dropdown, theme, Badge, Modal, message } from 'antd';
import {
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';

const { Header: AntHeader } = Layout;

export default function Header() {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 退出登录处理函数
  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录吗？',
      content: '退出后需要重新登录才能访问系统',
      okText: '确认退出',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        performLogout();
      },
    });
  };

  // 执行退出登录逻辑
  const performLogout = () => {
    try {
      // 1. 清除本地存储的 token
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      
      // 2. 清除 sessionStorage
      sessionStorage.clear();
      
      // 3. 清除可能的 cookie（如果有的话）
      document.cookie.split(';').forEach(c => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
      
      // 4. 显示成功消息
      message.success('退出登录成功');
      
      // 5. 跳转到登录页面
      setTimeout(() => {
        navigate('/login');
      }, 500);
      
      // 6. 强制刷新页面（可选，确保状态完全重置）
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('退出登录失败:', error);
      message.error('退出登录失败，请重试');
    }
  };

  // 下拉菜单项
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '个人中心',
      icon: <UserOutlined />,
      onClick: () => {
        navigate('/profile');
      },
    },
    {
      key: '2',
      label: '系统设置',
      icon: <SettingOutlined />,
      onClick: () => {
        navigate('/settings');
      },
    },
    {
      type: 'divider',
    },
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
        <Button 
          type="text" 
          icon={<QuestionCircleOutlined />} 
          style={{ fontSize: '16px' }}
          onClick={() => {
            window.open('/docs', '_blank');
          }}
        />

        {/* 2. 消息通知 */}
        <Badge count={5} size="small">
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            style={{ fontSize: '16px' }}
            onClick={() => {
              navigate('/notifications');
            }}
          />
        </Badge>

        {/* 3. 用户头像下拉 */}
        <Dropdown menu={{ items }} trigger={['click']}>
          <Space className={styles.headerRight} style={{ cursor: 'pointer' }}>
            <Avatar className={styles.avatar} icon={<UserOutlined />} />
            <span style={{ fontSize: '14px' }}>Admin User</span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}