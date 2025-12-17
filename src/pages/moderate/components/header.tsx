import { Input, Select, Form, theme } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { getCssVars } from '../../../utils/theme-utils';

interface FilterValues {
  keyword: string;
  user: string;
  auditStatus: string;
  resultStatus: string;
}

export default function ModerateHeader() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const handleValuesChange = (_: unknown, allValues: FilterValues) => {
    console.log('Filter values:', allValues);
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
        onValuesChange={handleValuesChange}
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
      </Form>
    </div>
  );
}
