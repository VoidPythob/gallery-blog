# 画廊博客（Gallery Blog）

一个基于 Vue 3 + TypeScript 的静态站点项目，用于展示画廊作品与博文内容，并提供标签聚合、主题切换、时间轴等能力。

## 功能概览

- 画廊作品展示
- 博文发布与阅读（Markdown）
- 标签系统（文章/图片均支持标签过滤）
- 标签视图（按标签查看内容，支持文章/图片模式切换）
- 每日一言
- 公告系统
- 时间轴展示（画廊 + 博文）
- 主题系统（亮色/暗色、主题色、滤镜、圆角、阴影）
- 友情链接与博主信息展示

## 技术栈

- `Vue 3`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `Animate.css`
- `vue-router`
- `Pinia`
- `markdown-it`
- `TDesign`
- `pnpm`

## 开发约束

- 组件库按需引入，避免全量打包
- `OSS base_url` 使用外部配置注入，不允许提交到仓库
- 响应式断点重点：`< 650px`

## 数据约定

### 1. 博文

存储路径：`public/posts/articles`

- 文件格式：`json`
- 文件命名：`uuid`

```ts
type Article = {
  title: string
  cover_url: string
  tags: string[]
  isToped: boolean
  readTime: number // 秒
  introduction: string
  markdown: string
}
```

### 2. 每日一言

存储路径：`public/posts/everyday-words.json`

- 数据结构：`string[]`
- 规则：每天随机一条，使用日期作为随机因子保证同日一致

### 3. 公告

存储路径：`public/posts/announcement.json`

- 数据结构：列表
- 当前阶段可按单条公告渲染

### 4. 时间轴

```ts
type TimelineItem = {
  date: string
  targetLink: string
}
```

## 视图与交互要求

### 博文列表

- 瀑布流布局，整体紧凑
- 每页固定 10 条
- 卡片支持主题适配与悬浮抬升效果
- 小屏（`< 650px`）切换为垂直布局

### 标签视图

- 目标：展示某个标签下的内容
- 模式切换：
- `文章模式`：仅显示该标签下博文
- `图片模式`：仅显示该标签下画廊图片
- 切换行为：同页切换，不跳转
- 规则：标签精确匹配
- 分页：两种模式独立分页，互不影响页码
- 空状态：某模式无数据时展示空状态文案

### 导航

- 同时提供侧边栏与顶部导航
- `< 650px` 时隐藏侧边栏，启用顶部导航
- 顶部导航：左站点名、中路由、右搜索，支持折叠菜单

### 通用分页

- 使用组件库分页组件
- 支持输入跳转页码
- 按钮风格为全圆角

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 本地开发

```bash
pnpm dev
```

### 3. 生产构建

```bash
pnpm build
```

### 4. 本地预览

```bash
pnpm preview
```

## 推荐目录结构

```text
.
├─ docs/
│  └─ dev.md
├─ public/
│  └─ posts/
│     ├─ articles/
│     ├─ everyday-words.json
│     └─ announcement.json
├─ src/
│  ├─ components/
│  ├─ views/
│  ├─ router/
│  ├─ stores/
│  └─ types/
└─ README.md
```

## 后续建议

- 将类型统一维护在 `src/types`
- 搜索索引在构建阶段生成，降低运行时开销
- 主题能力收敛为全局 design token
- 为 `public/posts` 下数据增加基础校验
