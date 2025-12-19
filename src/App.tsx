import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { useEffect } from 'react';
import { router } from './routes';
import { appTheme } from './theme';
import { apiClient } from './api/core';

// 创建一个组件来处理全局副作用（如注入 notification）
function AppContent() {
    const { notification } = AntdApp.useApp();

    useEffect(() => {
        // 将 notification 实例注入到 API Client 中
        apiClient.setNotificationApi(notification);
    }, [notification]);

    return <RouterProvider router={router} />;
}

function App() {
    return (
        <ConfigProvider theme={appTheme}>
            <AntdApp>
                <AppContent />
            </AntdApp>
        </ConfigProvider>
    );
}

export default App;
