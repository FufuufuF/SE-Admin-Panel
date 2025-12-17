import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import SideBar from './side-bar';
import Header from './header';
import styles from './index.module.less';

export default function DashborardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'all 0.2s' }}>
        <Header />
        <Layout.Content className={styles.content}>
          <div
            className={styles.contentContainer}
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
