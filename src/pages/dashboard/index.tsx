import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, Select, message, Table, Tag } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  AlertOutlined,
  CommentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CrownOutlined,
  FireOutlined,
  StarOutlined,
  TrophyOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import {
  fetchDashboardSummary,
  fetchUsersGrowth,
  fetchContentTypes,
  fetchTopTags,
  type DashboardSummary,
  type UsersGrowthData,
  type ContentTypesData,
  type TopTagsData,
} from './api';
import styles from './index.module.less';

const { Option } = Select;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [usersGrowth, setUsersGrowth] = useState<UsersGrowthData | null>(null);
  const [contentTypes, setContentTypes] = useState<ContentTypesData | null>(null);
  const [topTags, setTopTags] = useState<TopTagsData | null>(null);
  const [days, setDays] = useState<7 | 30>(7);

  // 定义表格列
  const tagRankColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      align: 'center' as const,
      render: (rank: number) => {
        let icon;
        let color;
        switch (rank) {
          case 1:
            icon = <TrophyOutlined style={{ color: '#FFD700' }} />;
            color = '#FFD700';
            break;
          case 2:
            icon = <CrownOutlined style={{ color: '#C0C0C0' }} />;
            color = '#C0C0C0';
            break;
          case 3:
            icon = <StarOutlined style={{ color: '#CD7F32' }} />;
            color = '#CD7F32';
            break;
          default:
            icon = <NumberOutlined />;
            color = '#8C8C8C';
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
            <span style={{ marginLeft: 4, fontWeight: 'bold', color }}>{rank}</span>
          </div>
        );
      },
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: { rank: number }) => {
        let color = '#1890ff';
        let bgColor = '#E6F7FF';

        // 根据排名设置不同的颜色
        if (record.rank === 1) {
          color = '#FF4D4F';
          bgColor = '#FFF1F0';
        } else if (record.rank === 2) {
          color = '#FF7A45';
          bgColor = '#FFF2E8';
        } else if (record.rank === 3) {
          color = '#FFC53D';
          bgColor = '#FFFBE6';
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tag
              style={{
                fontSize: '14px',
                padding: '4px 12px',
                borderRadius: '16px',
                borderColor: color,
                backgroundColor: bgColor,
                color: color,
                fontWeight: record.rank <= 3 ? 'bold' : 'normal',
              }}
            >
              {name}
            </Tag>
          </div>
        );
      },
    },
    {
      title: '使用次数',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      align: 'right' as const,
      sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
      render: (count: number, record: { rank: number }) => {
        let color = '#000000';
        if (record.rank === 1) {
          color = '#FF4D4F';
        } else if (record.rank === 2) {
          color = '#FF7A45';
        } else if (record.rank === 3) {
          color = '#FFC53D';
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <FireOutlined style={{ color: '#FF7A45', marginRight: 4 }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold', color }}>
              {count.toLocaleString()}
            </span>
            <span style={{ marginLeft: 4, fontSize: '12px', color: '#8C8C8C' }}>次</span>
          </div>
        );
      },
    },
    {
      title: '占比',
      key: 'percentage',
      width: 120,
      align: 'center' as const,
      render: (record: { count: number }) => {
        if (!topTags) return '-';

        const total = topTags.list.reduce((sum, item) => sum + item.count, 0);
        const percentage = ((record.count / total) * 100).toFixed(1);

        return (
          <div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{percentage}%</span>
          </div>
        );
      },
    },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, growthRes, typesRes, tagsRes] = await Promise.all([
        fetchDashboardSummary(),
        fetchUsersGrowth(days),
        fetchContentTypes(),
        fetchTopTags(10),
      ]);

      setSummary(summaryRes.data);
      setUsersGrowth(growthRes.data);
      setContentTypes(typesRes.data);
      setTopTags(tagsRes.data);
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [days]);

  // 用户增长趋势图配置
  const getLineChartOption = () => {
    if (!usersGrowth) return {};

    return {
      title: {
        text: '用户增长趋势',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: usersGrowth.series.map((item) => item.date),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: usersGrowth.series.map((item) => item.count),
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#1890ff',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.6)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
            ]),
          },
        },
      ],
    };
  };

  // 内容类型占比饼图配置
  const getPieChartOption = () => {
    if (!contentTypes) return {};

    return {
      title: {
        text: '内容类型占比',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '内容类型',
          type: 'pie',
          radius: '50%',
          data: contentTypes.items.map((item) => ({
            value: item.count,
            name: item.type === 'image' ? '图片' : item.type === 'video' ? '视频' : '文本',
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  };

  // 准备排行榜数据
  const getRankingData = () => {
    if (!topTags || !topTags.list) return [];

    return topTags.list.map((item, index) => ({
      key: index,
      rank: index + 1,
      name: item.name,
      count: item.count,
      rawData: item,
    }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>数据仪表盘</h1>
        <div className={styles.timeSelect}>
          <span>趋势周期：</span>
          <Select value={days} onChange={setDays} style={{ width: 120 }}>
            <Option value={7}>最近7天</Option>
            <Option value={30}>最近30天</Option>
          </Select>
        </div>
      </div>

      {/* 顶部数据卡片 */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={summary?.userTotal || 0}
              prefix={<UserOutlined />}
              suffix={
                <span
                  className={
                    summary?.userNewYesterday && summary.userNewYesterday > 0
                      ? styles.positive
                      : styles.negative
                  }
                >
                  {summary?.userNewYesterday || 0}
                  {summary?.userNewYesterday && summary.userNewYesterday > 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="动态总数"
              value={summary?.postTotal || 0}
              prefix={<FileTextOutlined />}
              suffix={`今日+${summary?.postNewToday || 0}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审核内容"
              value={summary?.pendingPostCount || 0}
              prefix={<AlertOutlined />}
              styles={{ content: { color: '#cf1322' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日评论"
              value={summary?.commentNewToday || 0}
              prefix={<CommentOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className={styles.chartsRow}>
        <Col xs={24} lg={12}>
          <Card className={styles.chartCard}>
            <ReactECharts option={getLineChartOption()} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className={styles.chartCard}>
            <ReactECharts option={getPieChartOption()} style={{ height: 400 }} />
          </Card>
        </Col>

        {/* 热门标签排行榜 */}
        <Col xs={24}>
          <Card
            className={styles.chartCard}
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TrophyOutlined style={{ color: '#FFD700', marginRight: 8 }} />
                <span>热门标签排行榜</span>
                <Tag color="red" style={{ marginLeft: 12 }}>
                  Top 10
                </Tag>
              </div>
            }
            extra={
              <div style={{ fontSize: '12px', color: '#8C8C8C' }}>
                数据更新时间: {new Date().toLocaleDateString()}
              </div>
            }
          >
            <Table
              columns={tagRankColumns}
              dataSource={getRankingData()}
              pagination={false}
              size="middle"
              rowKey="key"
              locale={{
                emptyText: '暂无标签数据',
              }}
              // 添加斑马纹样式
              rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-even' : 'table-row-odd')}
            />

            {/* 统计信息 */}
            {topTags && topTags.list && (
              <div
                style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  backgroundColor: '#fafafa',
                  borderRadius: 6,
                  fontSize: '13px',
                  color: '#595959',
                }}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FireOutlined style={{ marginRight: 4 }} />
                      <span>
                        总使用次数:{' '}
                        {topTags.list.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                      </span>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tag color="blue" style={{ marginRight: 4 }}>
                        标签总数
                      </Tag>
                      <span>{topTags.list.length}</span>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tag color="gold" style={{ marginRight: 4 }}>
                        冠军标签
                      </Tag>
                      <span>{topTags.list[0]?.name || '-'}</span>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tag color="purple" style={{ marginRight: 4 }}>
                        平均使用
                      </Tag>
                      <span>
                        {Math.round(
                          topTags.list.reduce((sum, item) => sum + item.count, 0) /
                            topTags.list.length
                        )}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
