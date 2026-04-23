# Portfolio（GitHub Pages）

线上地址：https://zhangzihaoDT.github.io/Portfolio/

本项目使用 Webpack 构建静态站点，并通过 `gh-pages` 分支发布到 GitHub Pages。

## 最终呈现在 .github.io 的页面是哪个？

- GitHub Pages 实际托管的是仓库的 `gh-pages` 分支内容
- 线上入口页面是 `gh-pages` 分支根目录下的 `index.html`
- 该 `index.html` 来自本地构建产物目录 `dist/`（由 `src/index.html` 模板生成）

## 源码与产物对应关系

- 页面骨架（固定结构）：`src/index.html`
- 页面内容（可动态更新）：`src/content.md`
- JS 入口与交互逻辑：`src/javascript/index.js`
- 内容解析与渲染逻辑：`src/javascript/content.js`
- 样式：`src/sass/*.scss`
- 构建产物（将被发布）：`dist/`
- 发布分支（GitHub Pages 托管）：`gh-pages`

## 内容编辑（推荐改这里）

页面的可变内容都在 `src/content.md` 中，修改后重新 `npm run start` 或 `npm run build` 即可更新页面。

### Front Matter（全局字段）

文件开头使用 `---` 包裹的键值对，示例字段：

- `name` / `role`：左侧侧栏标题与副标题
- `avatar`：头像图片路径（相对 `src/images/`）
- `resume_url`：简历按钮链接
- `nav`：侧栏导航，格式为 `标题|锚点id`，多个用逗号分隔
- `github_url` / `pinterest_url`：底部图标链接
- `wechat_image`：弹窗二维码图片路径

### Section 约定

`src/content.md` 使用固定的 section 标记来映射页面结构：

- `# One`：首页欢迎语与简介
- `# Two`：数据可视化（卡片列表）
- `# Three`：UX / UI 设计（卡片列表）
- `# Four`：文章（卡片列表 + 更多原创内容表格）

### 卡片条目（Item）

在 `# Two / # Three / # Four` 中使用以下约定定义卡片：

- 以 `## Item` 开始一个条目
- 后续用 `name:` `url:` `image:` 定义标题/链接/图片
- 再往后写正文段落（支持换行，支持 `[文本](链接)` 形式的内联链接）

### “更多原创内容”表格

在 `# Four` 中：

- 用 `more_title:` 定义表格标题
- 用列表行定义表格内容，格式：`- 日期 | 标题 | 链接`

## 本地开发

### 1) 安装依赖

```bash
npm install
```

### 2) 启动开发服务器

```bash
npm run start
```

## 构建

### 开发环境构建

```bash
npm run build
```

### 生产环境构建

```bash
npm run build-production
```

构建完成后会生成 `dist/`，其中包含：

- `dist/index.html`（由 `src/index.html` 通过 HtmlWebpackPlugin 生成）
- `dist/bundle.js`（由 `src/javascript/index.js` 打包生成）
- `dist/bundle.css`（由 scss 构建生成）
- 静态资源（图片/字体等）

## 发布到 GitHub Pages

### 1) 确认 GitHub Pages 配置

在 GitHub 仓库 Settings → Pages 中，将 Source 设为：

- Branch：`gh-pages`
- Folder：`/(root)`

### 2) 执行发布命令

```bash
npm run deploy
```

该命令等价于：

- 先构建得到 `dist/`
- 使用 `gh-pages -d dist -b gh-pages` 将 `dist/` 推送到远程的 `gh-pages` 分支

### 3) 验证发布结果

等待 GitHub Pages 更新后，访问：

- https://zhangzihaoDT.github.io/Portfolio/

## 常见问题

### 为什么 main 分支没有 bundle.css / bundle.js？

因为它们是构建产物，默认输出在 `dist/`，并发布到 `gh-pages` 分支用于线上托管；日常开发主要维护 `src/` 下的源码。
