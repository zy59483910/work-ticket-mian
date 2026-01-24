# 工单管理系统

一个基于 Vue3 + TypeScript + Vant 的移动端工单管理系统，支持工单提交、列表查看等功能。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供类型安全
- **Vant** - 轻量、可靠的移动端组件库
- **Vue Router** - Vue.js 官方路由管理器
- **Axios** - 基于 Promise 的 HTTP 客户端

## 项目结构

```
work-ticket-mian/
├── src/
│   ├── api/              # API 接口定义
│   │   ├── request.ts    # Axios 封装
│   │   └── workorder.ts  # 工单相关接口
│   ├── components/        # 组件
│   │   ├── WorkorderSubmit.vue   # 工单提交页面
│   │   └── WorkorderList.vue     # 工单列表页面
│   ├── router/           # 路由配置
│   │   └── index.ts
│   ├── types/           # 类型定义
│   │   └── global.d.ts
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── style.css        # 全局样式
├── index.html           # HTML 模板
└── package.json         # 项目配置
```

## 功能特性

### 工单提交页面

- ✅ 工单类型选择（单选）
- ✅ 工单标题输入
- ✅ 工单内容输入（多行文本）
- ✅ 发起人姓名输入
- ✅ 发起人电话输入（带格式验证）
- ✅ 工单等级选择（普通/紧急/加急）
- ✅ 通知人员选择（多选）
- ✅ 表单验证
- ✅ 拟态风格 UI 设计
- ✅ 移动端适配
- ✅ Toast 消息提示

### 工单列表页面

- ✅ 工单列表展示
- ✅ 工单状态筛选
- ✅ 工单等级筛选
- ✅ 搜索功能
- ✅ 下拉刷新
- ✅ 上拉加载更多

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

## 构建生产

```bash
npm run build
```

## 主要组件说明

### WorkorderSubmit.vue

工单提交页面组件，包含以下功能：

#### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|--------|------|
| 工单类型 | 单选 | 是 | 选择工单类型（设备故障、网络问题等） |
| 工单标题 | 文本 | 是 | 输入工单标题 |
| 工单内容 | 多行文本 | 是 | 输入工单详细内容 |
| 发起人姓名 | 文本 | 是 | 输入发起人姓名 |
| 发起人电话 | 电话 | 是 | 输入发起人电话（11位手机号） |
| 工单等级 | 单选 | 否 | 选择工单等级（普通/紧急/加急） |
| 通知人员 | 多选 | 是 | 选择通知人员 |

#### 表单验证

- 工单类型：必选
- 工单标题：必填
- 工单内容：必填
- 发起人姓名：必填
- 发起人电话：必填 + 手机号格式验证
- 通知人员：必选

#### 使用示例

```vue
<template>
  <WorkorderSubmit />
</template>

<script setup>
import WorkorderSubmit from '@/components/WorkorderSubmit.vue'
</script>
```

### API 接口

#### 创建工单

```typescript
import { workorderApi } from '@/api/workorder'

const form = {
  workorderTypeId: 12435,
  workorderTitle: '设备故障',
  workorderContent: '服务器无法启动',
  initiatorName: '张三',
  initiatorPhone: '13800138000',
  level: 1,
  noticeIds: '1,2,3'
}

await workorderApi.createWorkorder(form)
```

#### 获取工单列表

```typescript
import { workorderApi } from '@/api/workorder'

const list = await workorderApi.getWorkorderList({
  pageNo: 1,
  pageSize: 10,
  status: 1
})
```

## 样式设计

### 拟态风格（Neumorphism）

项目采用拟态风格设计，具有以下特点：

- 🎨 柔和的阴影效果
- 📦 凸起和凹陷的视觉层次
- 🌟 统一的配色方案
- 📱 适合移动端操作

### 配色方案

| 颜色 | 用途 | 十六进制 |
|------|------|----------|
| 主背景 | 页面背景 | #f8f9fa |
| 卡片背景 | 卡片元素 | #ffffff |
| 主色调 | 按钮、链接 | #1989fa |
| 错误色 | 错误提示 | #ff4d4f |
| 文本色 | 主要文字 | #333333 |
| 辅助色 | 次要文字 | #666666 |

## Toast 消息提示

项目已全局注册 Toast 组件，可在任何组件中使用：

```typescript
import { Toast } from 'vant'

// 成功提示
Toast.success({
  message: '操作成功',
  duration: 2000,
  position: 'top'
})

// 失败提示
Toast.fail({
  message: '操作失败',
  duration: 2000,
  position: 'top'
})

// 加载提示
Toast.loading({
  message: '加载中...',
  duration: 0,
  forbidClick: true
})

// 关闭提示
Toast.clear()
```

## 移动端适配

### 禁止页面缩放

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```

### 防止 iOS 输入框放大

```css
:deep(.van-field__control) {
  font-size: 16px !important;
}
```

### 响应式布局

```css
/* 设计稿基准宽度 */
:root {
  --design-width: 375;
  font-size: calc(100vw / var(--design-width) * 10);
}
```

## 浏览器支持

- Chrome (最新版)
- Safari (最新版)
- Firefox (最新版)
- Edge (最新版)
- 微信内置浏览器

## 开发规范

### 代码注释

所有代码必须包含详细的中文注释：

```typescript
/**
 * 提交表单
 */
const submitForm = async () => {
  // 表单验证
  if (!validateForm()) {
    return;
  }

  try {
    // 调用API提交工单
    await workorderApi.createWorkorder(form);
  } catch (error) {
    console.error("提交工单失败:", error);
  }
};
```

### 类型定义

使用 TypeScript 进行类型定义：

```typescript
interface WorkorderForm {
  id: number
  workorderTypeId: number
  workorderTitle: string
  workorderContent: string
  initiatorName: string
  initiatorPhone: string
  level: number
  noticeIds: string
}
```

## 常见问题

### 1. 表单验证不显示？

确保在 `van-field` 组件上添加了 `:error-message` 属性：

```vue
<van-field
  v-model="form.field"
  :error-message="errors.field"
/>
```

### 2. iOS 点击输入框页面放大？

已通过设置输入框字体大小为 16px 解决此问题。

### 3. 如何自定义 Toast 样式？

通过 Vant 的 Toast 组件提供的参数进行自定义：

```typescript
Toast.success({
  message: '自定义消息',
  duration: 3000,
  position: 'bottom',
  className: 'custom-toast'
})
```

## 更新日志

### v1.0.0 (2026-01-24)

- ✨ 初始版本发布
- ✅ 工单提交功能
- ✅ 工单列表功能
- ✅ 拟态风格 UI
- ✅ 移动端适配
- ✅ Toast 消息提示

## 许可证

MIT

## 联系方式

如有问题，请联系开发团队。
