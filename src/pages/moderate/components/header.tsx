import { Input, Select, Form, Button, theme } from 'antd';
import { SearchOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { getCssVars } from '@/utils/theme-utils';
import { usePost } from '@/hooks';
import { type FilterValues } from '@/store/post-store';

export default function ModerateHeader() {
  const { token } = theme.useToken();
  const [form] = Form.useForm<FilterValues>();
  const { setFilters } = usePost();

  const handleApplyFilter = () => {
    const values = form.getFieldsValue();
    setFilters(values);
  };

  const cssVars = getCssVars(token);

  return (
    <div
      className={styles.headerWrapper}
      style={{ backgroundColor: token.colorBgContainer, ...cssVars }}
    >
      <div className={styles.titleRow}>
        <h2 style={{ color: token.colorText }}>审核列表</h2>
      </div>
      <Form
        form={form}
        layout="inline"
        className={styles.filterForm}
        initialValues={{
          keyword: '',
          user: '',
          auditStatus: 'all',
          resultStatus: 'all',
        }}
      >
        <Form.Item name="keyword" className={styles.inputItem}>
          <Input
            prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />}
            placeholder="搜索帖子内容"
            allowClear
          />
        </Form.Item>

        <Form.Item name="user" className={styles.inputItem}>
          <Input
            prefix={<UserOutlined style={{ color: token.colorTextDescription }} />}
            placeholder="搜索用户"
            allowClear
          />
        </Form.Item>

        <Form.Item name="auditStatus" className={styles.selectItem}>
          <Select
            placeholder="审核状态"
            options={[
              { label: '全部状态', value: 'all' },
              { label: '待审核', value: 'pending' },
              { label: '已审核', value: 'reviewed' },
              { label: '已通过', value: 'pass' },
              { label: '未通过', value: 'fail' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="resultStatus"
          className={styles.selectItem}
          shouldUpdate={(prev: FilterValues, curr: FilterValues) =>
            prev.auditStatus !== curr.auditStatus
          }
        >
          {({ getFieldValue }) => {
            const auditStatus = getFieldValue('auditStatus');
            const isPending = auditStatus === 'pending';

            return (
              <Select
                placeholder="审核结果"
                disabled={isPending}
                options={[
                  { label: '全部结果', value: 'all' },
                  { label: '已通过', value: 'pass' },
                  { label: '未通过', value: 'fail' },
                ]}
              />
            );
          }}
        </Form.Item>

        <Form.Item>
          <Button type="primary" icon={<FilterOutlined />} onClick={handleApplyFilter}>
            筛选
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
