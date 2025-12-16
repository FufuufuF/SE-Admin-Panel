import { Table, Tag, Space, Button, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { find } from './api';

// 1. 定义数据类型 (TypeScript)
interface UserType {
  key: string;
  name: string;
  age: number;
  phone: string;
  role: string;
  status: 'active' | 'banned';
  joinDate: string;
}

// 2. 模拟一些假数据
const data: UserType[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  name: `用户 ${i + 1}`,
  age: 20 + (i % 10),
  phone: `138001380${i < 10 ? '0' + i : i}`,
  role: i % 3 === 0 ? '管理员' : '普通用户',
  status: i % 5 === 0 ? 'banned' : 'active', // 每5个设为一个封禁状态
  joinDate: '2023-12-16',
}));

export default function Users() {
  const handleFind = async () => {
    try {
      const response = await find();
      console.log(response);
    } catch (error) {
      console.error('查询失败:', error);
    }
  };

  // 3. 定义表格列
  const columns: ColumnsType<UserType> = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '已封禁'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => message.info(`你点击了删除: ${record.name}`)}
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
          <Input placeholder="输入用户名搜索" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Button type="primary" onClick={handleFind}>
            查询
          </Button>
        </Space>

        <Button type="primary" icon={<PlusOutlined />}>
          新增用户
        </Button>
      </div>

      {/* B. 数据表格 */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }} // 分页设置
      />
    </div>
  );
}
