# 画廊博客（Gallery Blog）

一个基于 Vue 3 + TypeScript + Vite 的画廊博客站点，支持文章与图片内容展示、主题切换和移动端适配。

## 项目实现内容

- 首页首屏展示：博客名称与每日一言打字效果，支持一键进入内容区。
- 统一布局系统：透明玻璃感 Topbar + 内容区布局；桌面端显示侧边栏，移动端使用抽屉导航。
- 导航系统：顶部导航与侧边导航统一配置，支持图标、路由跳转与高亮联动。
- 搜索系统：按页面名称模糊搜索，支持候选下拉、键盘上下选择与回车跳转。
- 文章系统：
  - 文章列表展示与分页。
  - 文章详情页支持 Markdown 渲染与主题化样式。
  - 卡片可直接跳转详情页。
- 画廊系统：
  - 瀑布流展示，按原始比例渲染图片。
  - 图片懒加载、骨架屏、加载失败占位。
  - 支持悬停放大与鼠标跟随 3D 倾斜效果。
  - 画廊详情页支持 TDesign 图片查看器弹窗预览。
- 标签系统：
  - 标签页支持文章/图片模式切换。
  - 根据标签关系表加载对应文章与画廊数据。
  - 标签数据使用数字 ID 并支持路由联动。
- 主题系统：
  - 明暗模式切换（Switch）。
  - 主题色、滤镜、圆角、阴影调节。
  - 右下角固定主题设置面板，支持弹出层交互与移动端滚动适配。
- 数据外置化：动态业务数据放在 `public/posts`，通过 JSON 配置驱动页面内容。
- 工程化能力：
  - 单元测试（Vitest + Vue Test Utils）
  - CI 流程（自动测试 / 自动部署）
  - 打包优化（按需加载与分包控制）

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- TDesign Vue Next
- TDesign Icons Vue Next
- Markdown-It
- Animate.css
- Tailwind CSS
- Vitest
- pnpm

## 目录结构

```text
.
├─ docs/
│  └─ dev.md
├─ public/
│  └─ posts/
│     ├─ articles.json
│     ├─ gallery-items.json
│     ├─ tags.json
│     ├─ tag-article-links.json
│     ├─ tag-gallery-links.json
│     ├─ everyday-words.json
│     ├─ announcement.json
│     └─ blogger.json
├─ src/
│  ├─ components/
│  ├─ views/
│  ├─ layouts/
│  ├─ router/
│  ├─ stores/
│  ├─ data/
│  └─ styles/
├─ tests/
└─ README.md
```

## 构建与运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发环境

```bash
pnpm dev
```

### 3. 执行测试

```bash
pnpm test
```

### 4. 生产构建

```bash
pnpm build
```

### 5. 本地预览构建产物

```bash
pnpm preview
```
