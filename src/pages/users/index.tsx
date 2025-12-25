import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Space, Button, Input, message, Spin, Modal, Form, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getUsers, type User } from './api';

export default function Users() {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]); // 存储所有用户数据
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // 过滤后的用户数据
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 新增用户相关状态
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // 加载所有用户数据（一次性获取）
  const loadAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      console.log('加载所有用户数据...');
      const response = await getUsers(); // 不传参数，获取所有用户
      console.log('API响应:', response);
      setAllUsers(response.data.list);
      setTotal(response.data.total);
    } catch (error) {
      console.error('加载用户列表失败:', error);
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 前端过滤用户数据
  const filterUsers = useCallback((keyword: string) => {
    if (!keyword.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        user.nickname.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // 搜索时重置到第一页
  }, [allUsers]);

  // 加载用户数据（分页显示）
  const loadUsers = useCallback(async (page = 1, keyword = '') => {
    // 如果还没有加载过所有数据，先加载
    if (allUsers.length === 0) {
      await loadAllUsers();
    }
    // 应用过滤
    filterUsers(keyword);
    setCurrentPage(page);
  }, [allUsers.length, loadAllUsers, filterUsers]);

  // 搜索用户
  const handleSearch = useCallback(() => {
    console.log('搜索关键词:', searchKeyword);
    filterUsers(searchKeyword);
    setCurrentPage(1);
  }, [filterUsers, searchKeyword]);

  // 修改用户状态（前端模拟）
  const handleChangeStatus = useCallback((user: User, newStatus: 'active' | 'banned') => {
    // 直接更新本地状态，不调用后端API
    setAllUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    message.success(`用户 ${user.nickname} 已${newStatus === 'banned' ? '封禁' : '解禁'}`);
  }, []);

  // 删除用户（前端模拟）
  const handleDeleteUser = useCallback((user: User) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除用户 "${user.nickname}" 吗？此操作无法撤销。`,
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk() {
        // 从allUsers中移除用户
        setAllUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
        message.success(`用户 "${user.nickname}" 已删除`);
      },
    });
  }, []);

  // 新增用户（前端模拟）
  const handleAddUser = useCallback(async (values: any) => {
    try {
      // 生成新用户ID（简单的方式）
      const newId = Math.max(...allUsers.map(u => u.id), 0) + 1;

      const newUser: User = {
        id: newId,
        username: values.username,
        nickname: values.nickname,
        status: values.status,
        createdAt: new Date().toLocaleString(),
      };

      // 添加到用户列表
      setAllUsers(prevUsers => [...prevUsers, newUser]);
      setIsAddModalVisible(false);
      addForm.resetFields();
      message.success('用户添加成功');
    } catch (error) {
      console.error('添加用户失败:', error);
      message.error('添加用户失败');
    }
  }, [allUsers, addForm]);

  // 组件挂载时加载数据
  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  // 当allUsers变化时，初始化filteredUsers
  useEffect(() => {
    setFilteredUsers(allUsers);
  }, [allUsers]);

  // 计算当前页显示的数据
  const currentPageData = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 3. 定义表格列
  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status: 'active' | 'banned') => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '已封禁'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'active' ? (
            <Button
              type="text"
              style={{ color: '#faad14' }}
              onClick={() => handleChangeStatus(record, 'banned')}
            >
              封禁
            </Button>
          ) : (
            <Button
              type="text"
              style={{ color: '#52c41a' }}
              onClick={() => handleChangeStatus(record, 'active')}
            >
              解禁
            </Button>
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* A. 顶部工具栏：搜索 + 按钮 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="输入用户名搜索"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Space>

        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
          新增用户
        </Button>
      </div>

      {/* B. 数据表格 */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={currentPageData}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredUsers.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
            showSizeChanger: false,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Spin>

      {/* 新增用户弹窗 */}
      <Modal
        title="新增用户"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddUser}
          initialValues={{ status: 'active' }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="banned">已封禁</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsAddModalVisible(false);
                addForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
