import type { GlobalToken } from 'antd';
import React from 'react';

/**
 * 将 Ant Design 的 Design Token 映射为 CSS 变量
 * 这允许我们在 CSS Modules (Less) 文件中使用这些 Token
 *
 * 使用方法:
 * 1. 在组件中获取 token: const { token } = theme.useToken();
 * 2. 生成 CSS 变量样式: const cssVars = getCssVars(token);
 * 3. 将样式应用到根元素: <div style={cssVars}>...</div>
 * 4. 在 Less 文件中使用: color: var(--text-color);
 */
export const getCssVars = (token: GlobalToken): React.CSSProperties => {
  return {
    '--primary-color': token.colorPrimary,
    '--primary-bg-hover': token.colorPrimaryBg,

    '--text-color': token.colorText,
    '--text-secondary-color': token.colorTextSecondary,
    '--text-description-color': token.colorTextDescription,

    '--border-color': token.colorBorderSecondary,

    '--bg-color': token.colorBgContainer,
    '--header-bg': token.colorBgContainer,

    '--hover-bg': token.colorFillAlter,
    '--hover-icon-bg': token.colorFillSecondary,

    '--warning-color': token.colorWarning,
    '--warning-bg': token.colorWarningBg,

    '--success-color': token.colorSuccess,
    '--success-bg': token.colorSuccessBg,

    '--error-color': token.colorError,
    '--error-bg': token.colorErrorBg,
  } as React.CSSProperties;
};
