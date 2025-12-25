import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store';
import { apiClient } from '@/api/core/client';
import styles from './index.module.less';

const { Title } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 注意：这里使用的是管理员登录接口，根据文档应该是 /admin/v1/auth/login
      const response = await apiClient.post<
        {
          code: number;
          msg: string;
          data: { accessToken: string; user: Parameters<typeof login>[1] };
        },
        LoginForm
      >('/admin/v1/auth/login', values);
      const { accessToken, user } = response.data;

      // 保存 token 和用户信息
      login(accessToken, user);
      localStorage.setItem('access_token', accessToken);

      message.success('登录成功！');
      navigate('/dashboard');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <Title level={2} className={styles.title}>
            多媒体展示平台
          </Title>
          <p className={styles.subtitle}>管理员登录</p>
        </div>

        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="管理员账号" autoComplete="username" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
