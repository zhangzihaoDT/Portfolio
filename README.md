# Portfolio

**From Design to Data to AI Tools** · 一个 90 后上班族的能力迁移记录

线上地址：https://zhangzihaodt.github.io/Portfolio/

## 项目定位

这不是一份传统作品集，而是一个叙事型个人首页。围绕「我为什么走到了这里」展开，展示从平面设计 → 数据分析 → 汽车行业 → AI Tools 的能力演化路径。

## 项目结构

```
Portfolio/
├── src/                     # 发布目录（GitHub Pages 源）
│   ├── index.html           # 页面骨架，内嵌 JSON 数据
│   ├── styles.css           # 全部样式
│   ├── main.js              # 数据读取 + 动态渲染 + 导航
│   ├── data.json            # 结构化内容源文件
│   ├── .nojekyll            # 禁止 Jekyll 构建
│   ├── images/              # 静态图片资源
│   │   ├── fulls/           # 作品/案例封面图
│   │   └── overlay.png      # 卡片蒙版纹理
│   ├── fonts/
│   └── webfonts/
├── archive/                 # 旧版文件备份
│   ├── old-index.html
│   ├── old-main.scss
│   ├── old-index.js
│   └── old-content.js
├── assets/                  # 品牌资产
├── package.json
└── README.md
```

## 本地开发

```bash
npm run dev      # python3 -m http.server 8080 -d src
# 或直接
open src/index.html
```

## 数据编辑

所有卡片、案例、项目内容集中在两个位置：

1. **`src/data.json`** — 完整结构化数据，修改后需同步到 index.html
2. **`src/index.html`** 中的 `<script id="page-data">` — 内联数据，页面实际读取来源

`main.js` 从 `page-data` 读取 JSON，渲染到各容器：

| 渲染函数 | 目标容器 | 数据来源 |
|---|---|---|
| `renderDesignCards` | `#design-cards` | `data.design.cards` |
| `renderDataCases` | `#data-cases` | `data.data.cases` |
| `renderAutoChain` / `renderAutoMatrix` | `#auto-chain` / `#auto-matrix` | `data.auto` |
| `renderAiCards` / `renderAiCapabilities` | `#ai-cards` / `#ai-capabilities` | `data.ai` |
| `renderProjects` | `#project-list` | `data.projects` |
| `renderCapability` | `#capability-grid` | `data.capability` |

每个项目/卡片可设置 `narrativeRole`，可选值：

- `design-foundation` — 设计底座
- `data-foundation` — 数据能力
- `auto-industry` — 行业训练场
- `ai-tooling` — AI 工具化
- `life-product` — 生活产品化

## 发布到 GitHub Pages

```bash
npm run deploy    # gh-pages -d src -b gh-pages
```

发布后等待 CDN 刷新（1-10 分钟），访问：

- https://zhangzihaodt.github.io/Portfolio/

## 技术栈

- 纯 HTML + CSS + 原生 JavaScript
- 无框架、无构建工具、无外部依赖
- 数据驱动渲染（JSON → DOM）
- 响应式布局，桌面端/移动端可读
