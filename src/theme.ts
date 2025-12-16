import { theme } from 'antd';
import { geekblue, grey, greyDark } from '@ant-design/colors';

// 你的项目主题配置：灰黑 + 蓝色
// 灰黑背景由 Ant Design Dark Algorithm 自动处理
// 蓝色点缀由 geekblue[5] 提供
export const appTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    // 主色调：使用极客蓝，科技感强，符合"灰黑+蓝"的需求
    colorPrimary: geekblue[5],

    // 基础圆角：2px，保持硬朗的工业风
    borderRadius: 2,

    // 侧边栏/导航栏背景色调整
    // 使用 @ant-design/colors 预设颜色
    // grey[8] 是纯黑 #000000
    // greyDark[0] 是深灰 #151515 (接近标准的 #141414)
    colorBgContainer: greyDark[0], // 容器背景
    colorBgLayout: grey[8], // 整体布局背景 (纯黑)
  },
  components: {
    Layout: {
      // 侧边栏背景色：使用深灰黑
      siderBg: greyDark[0],
      // 触发器背景色：稍微亮一点
      triggerBg: greyDark[1], // #1f1f1f
    },
    Menu: {
      // 菜单背景色同步
      darkItemBg: greyDark[0],
      // 选中项背景色
      darkItemSelectedBg: greyDark[1],
    },
  },
};
