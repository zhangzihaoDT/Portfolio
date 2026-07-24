# Portfolio Blog 文章规范 & 模板

> 用途：作为 Portfolio `/blog/` 板块的统一写作与排版规范。
> 后续文章应优先保持本文档规定的页面结构、内容层级、组件用法和视觉节奏。
> 参考实现：`time-series-evolution.html`。

---

## 1. 核心原则

Blog 文章应呈现为一篇可长期阅读、可被检索、可体现个人能力的正式文章，而不是单张信息卡或纵向海报。

1. **正文优先**：普通观点使用正文表达，图表和卡片只辅助关键内容。
2. **左对齐阅读**：标题、导语、正文和章节标题均以左对齐为主。
3. **层级稳定**：每篇文章都应有清晰的标题、导语、章节、结论和参考资料。
4. **组件克制**：一屏内避免连续出现多个高饱和色块。
5. **移动端可读**：不通过缩小字号解决空间问题，而是调整布局。
6. **Portfolio 导向**：文章不仅传递知识，也应体现分析框架、判断能力和相关项目经验。
7. **移除大卡片包装**：正文区域与背景直接衔接，不使用整页大卡片、阴影和外边框。

---

## 2. Markdown Front Matter

每篇文章开头必须包含以下元信息：

```yaml
---
title: 时间序列预测
lead: 从统计模型到 Foundation Model + LLM。TimesFM 是否会替代 Prophet？LLM 在预测系统中究竟承担什么角色？
date: 2026-07-24
updated: 2026-07-24
author: zihao raccoon
reading_time: 8 分钟
category: 数据科学
tags:
  - 时间序列
  - Foundation Model
  - 数据科学
slug: time-series-evolution
status: published
---
```

字段说明：

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `title` | 是 | 页面主标题，建议 8～20 个汉字 |
| `lead` | 是 | 标题下方导语，回答文章讨论什么问题 |
| `date` | 是 | 首次发布日期，固定日期 |
| `updated` | 是 | 最后一次实质更新日期 |
| `author` | 是 | 默认 `zihao raccoon` |
| `reading_time` | 是 | 根据正文长度估算 |
| `category` | 是 | 一个主要分类 |
| `tags` | 是 | 建议 2～4 个 |
| `slug` | 是 | URL 使用的小写英文短语 |
| `status` | 是 | `draft` 或 `published` |

时间戳使用固定值，**不要在页面运行时用 JavaScript 自动生成**。

---

## 3. 页面固定结构

每篇文章生成 HTML 后，整体结构保持一致：

```text
顶部导航
  ├─ 返回 Blog  ← 链接到 /blog/
  └─ zihao raccoon  ← 品牌名

标题区
  ├─ 面包屑：Portfolio / Blog
  ├─ 标签（2-3 个）
  ├─ 主标题 h1
  ├─ 导语（1-2 行）
  └─ 元信息：作者 / 发布日期 / 更新日期 / 阅读时间

正文（max-width: 760px）
  ├─ 01 背景或问题
  ├─ 02 核心分析
  ├─ 03 对比或判断
  ├─ 04 方法、框架或案例
  ├─ 05 延伸讨论
  └─ 06 结论

表格/图表（visual-wide，可扩展到 820px）

文章尾部
  ├─ 参考与延伸阅读
  ├─ 相关项目或相关文章
  ├─ 上一篇 / 返回 Blog / 下一篇
  └─ Copyright
```

不要求每篇文章恰好六章，但建议控制在 **4～7 个一级章节**。

### HTML 容器规格

| 元素 | 样式 |
|------|------|
| 正文区 `.article` | `max-width: 760px; margin: 0 auto; padding: 56px 24px 80px;` |
| 正文内 p、li | `max-width: 680px;` |
| 宽版容器 `.visual-wide` | 桌面端 `margin-left/right: -40px` |

页面背景：`#FFF9EF`（cream）。不使用大卡片包装，圆角仅用于内部组件。

---

## 4. 标题层级

### 4.1 页面主标题

Markdown 中只允许出现一个一级标题。实际页面中，主标题由 Front Matter 的 `title` 生成，正文不再重复写 `#`。

### 4.2 一级章节

使用二级标题，统一添加两位编号：

```markdown
## 01 模型范式如何演进
## 02 各类模型分别解决什么问题
## 03 TimesFM 会替代 Prophet 吗
```

要求：

- 编号从 `01` 开始。
- 标题应表达问题或判断，不只写抽象名词。
- 每个二级标题前可配置一个英文 Section Label。
- 二级标题之间应有足够正文，不连续堆叠。

### 4.3 Section Label（英文标签）

```html
<span class="section-label">Evolution</span>
<h2>01 模型范式如何演进</h2>
```

Section Label 作为 eyebrow 置于 h2 上方，字号 11px、金色、uppercase。推荐词汇：

`Context` · `Evolution` · `Positioning` · `Comparison` · `Framework` · `Architecture` · `Case Study` · `Insight` · `Summary` · `References` · `Project`

Section Label 只起辅助作用，**不能代替中文章节标题**。

### 4.4 二级小节

使用三级标题：

```markdown
### 示例：汽车销量预测日报
```

三级标题无需编号。原则上不使用四级及以下标题。

### 4.5 字号表

| 级别 | 桌面端 | 移动端 |
|------|--------|--------|
| h1（主标题） | 38px | 28px |
| h2（章节） | 26px | 22px |
| h3（子章节） | 19px | 17px |
| 正文 | 16px | 16px |
| 导语 | 17px | 16px |

---

## 5. 开篇写法

标题区之后，正文第一章应在较短篇幅内回答：

1. 这篇文章讨论什么问题？
2. 为什么这个问题值得讨论？
3. 文章将给出什么判断或框架？

推荐开篇长度 **100～250 字**。

避免：

- 从宏大背景开始铺垫太久。
- 连续解释多个术语却没有提出问题。
- 一开始就堆表格和模型名称。
- 使用"本文将从三个方面……"式的论文腔。

推荐：

```markdown
时间序列预测的发展并不是简单的"新模型替代旧模型"，而是经历了从人工定义规律、
人工构造特征，到模型学习表示和跨数据集预训练的范式变化。

真正值得回答的问题不是 TimesFM 是否比 Prophet 更新，
而是两者在实际预测系统中分别承担什么角色。
```

---

## 6. 正文写作规范

### 段落

- 每段建议 2～5 句。
- 单段尽量不超过 180 个汉字。
- 段落之间留出空行。
- 每段只表达一个核心意思。
- 中文正文使用全角标点。

### 强调

使用粗体强调核心概念和结论。一段中粗体不宜超过 2～3 处，不要连续整段加粗。

### 引号

概念性表达使用中文引号："人工定义规律"。模型名、技术名和代码变量不加中文引号。

### 英文术语

首次出现时使用"零样本预测（Zero-shot Forecasting）"格式。后文可只使用中文或英文简称。

---

## 7. 标准内容组件

正文以普通 Markdown 为主。只有当内容满足明确用途时，才使用以下组件。

### 7.1 关键判断框 Insight

用途：强调文章中最重要的判断、修正或结论。

```markdown
> [!INSIGHT]
> **综合来看：** Prophet 更适合作为可解释基线，TimesFM / Chronos 更适合作为复杂预测场景的主模型。两者不是简单替代关系。
```

HTML 映射：`.insight`（左侧 3px cyan 竖线，浅蓝色底）。

限制：每篇 1～3 个，不用于普通补充说明，一般不超过 120 字，不连续出现两个。

### 7.2 深色结论框 Conclusion

用途：全文最后的核心总结。

```markdown
> [!CONCLUSION]
> 时间序列 Foundation Model 负责预测，LLM 负责理解、解释和决策支持。
```

HTML 映射：`.conclusion`（深蓝底 `#06213D`，白字，cyan 高亮）。

限制：每篇最多一个，原则上只放在最后一章。结论应能脱离上下文单独成立。

### 7.3 公式框 Formula

用途：展示核心公式或结构表达。

```markdown
$$
y(t) = trend(t) + seasonality(t) + holidays(t) + error(t)
$$
```

HTML 映射：`.formula-box`（浅蓝底，居中 monospace）。

要求：公式独占一行，前后必须有解释。不把自然语言塞进公式框。

### 7.4 对比表格

用途：比较模型、方案、指标、阶段或概念。

```markdown
| 维度 | Prophet | TimesFM |
|---|---|---|
| 核心方法 | 加法分解 | 预训练 Transformer |
| 可解释性 | 强 | 弱 |
| 适用场景 | 业务基线 | 复杂模式预测 |
```

要求：

- 建议 3～6 行、2～5 列。
- 第一列写比较维度。
- 关键行可在 HTML 中增加 `.highlight-row`。
- 不使用表格排版普通正文。

**移动端处理**：桌面端使用标准表格，移动端自动切换为上下对照卡片（`.compare-mobile` / `.compare-desktop` 的 `display` 切换），表格上方加滑动提示 `.scroll-hint`。

### 7.5 时间线 Timeline

用途：表达技术演进、过程阶段、历史变化。

```markdown
<!-- component: timeline -->

- 统计建模｜ARIMA、Prophet｜人工定义趋势、季节性和节假日
- 特征工程｜LightGBM、XGBoost｜人工构造时滞和统计特征
- 表示学习｜LSTM、TFT｜模型自动学习时序模式
- 跨序列预训练｜TimesFM、Chronos｜零样本和跨序列迁移
```

HTML 映射：`.timeline-flow`。每个阶段包含 `tl-era`（范式名）、`tl-tag`（模型名）、`tl-desc`（核心思路）。

要求：桌面端横向或分层，移动端纵向，`current` 类标识最新方向（金色边框）。

### 7.6 编号场景列表

用途：展示选择建议、典型场景或操作路径。

```markdown
1. **需要业务解释**
   使用 Prophet，保留趋势、季节和节假日分解。

2. **优先追求预测表现**
   使用 TimesFM / Chronos，处理复杂模式和多序列。

3. **建设工业级系统**
   使用基线模型、Foundation Model 和 LLM 的组合。
```

HTML 映射：`.scenario-list`（浅蓝底圆角卡片，左侧编号）。

建议 3～5 项。不为每个普通要点单独制作卡片。

### 7.7 架构图 Architecture

用途：展示输入、模型、上下文和输出之间的关系。

```markdown
<!-- component: architecture -->

历史销量与业务变量
→ Prophet（可解释基线） + TimesFM（主预测模型）
→ 融合预测结果
+ 竞品价格、政策、天气、营销活动
→ LLM（解释、归因、生成）
→ 业务报告与决策建议
```

HTML 映射：`.arch-diagram`。盒子类型包括：

| 类名 | 用途 |
|------|------|
| 默认 | 一般节点（浅蓝底） |
| `.baseline` | 基线模型（灰色底） |
| `.primary` | 主模型（金色边框） |
| `.llm-box` | LLM（蓝色边框） |
| `.context` | 外部上下文（虚线边框） |
| `.result` | 输出结果（cyan 边框） |

要求：

- 明确标注输入和输出。
- 外部信息必须作为单独的上下文输入出现（虚线 `.context` 盒子）。
- 不将因果解释伪装为模型直接输出。
- 移动端转为纵向流程，箭头旋转 90°。

### 7.8 相关项目 Project Card

用途：把文章连接到 Portfolio 项目案例。构建系统**不自动生成**此部分，需要时直接在生成的 `.html` 中手写。

```html
<a class="project-card" href="/projects/auto-sales-forecast/">
  <div class="pc-label">Case Study</div>
  <div class="pc-title">汽车销量预测与日报生成</div>
  <div class="pc-desc">TimesFM 预测 + LLM 自动生成业务日报的完整实现</div>
  <span class="pc-arrow">查看项目 →</span>
</a>
```

每篇最多 1～2 个，必须与文章主题直接相关。

---

## 8. 图片与图表规范

1. 普通正文宽度约 `680px`。
2. 复杂图表可以使用宽版容器，桌面端扩展到约 `840px`。
3. 图片必须有说明文字或上下文解释。
4. 不连续放置两张没有文字过渡的图片。
5. 移动端不得依赖极小字号维持桌面布局。

```markdown
![时间序列模型的四次范式变化](../assets/time-series-evolution.png)

*图 1：时间序列预测从人工定义规律逐渐走向跨数据集预训练。*
```

---

## 9. 参考资料

```markdown
## 参考与延伸阅读

1. [TimesFM · Google Research](https://github.com/google-research/timesfm)
   Time Series Foundation Model，海量时间序列预训练。

2. [Chronos · Amazon Science](https://github.com/amazon-science/chronos-forecasting)
   基于语言模型范式的时间序列预测框架。
```

HTML 映射：`.ref-list`。要求：每条加一句说明，优先使用官方文档/论文/仓库，外部链接 `target="_blank" rel="noopener noreferrer"`。

---

## 10. 文章结尾

标准结尾由三部分组成：

### 10.1 正文结论

最后一章应回答开篇问题、给出明确判断、说明适用边界。

### 10.2 参考与延伸阅读

按第 9 节规范处理。

### 10.3 Portfolio 连接

增加相关项目卡片。页面底部固定保留上一篇/返回 Blog/下一篇导航（`.pager`）。

### 10.4 文章 Footer

```html
<footer class="article-footer">
  <span class="copyright">© 2026 zihao raccoon</span>
  <span class="copyright">Opinions are my own.</span>
</footer>
```

---

## 11. 移动端规范

移动端不是桌面版的等比例缩小，应做布局转换：

- 正文保持 `16px`，不降为 `14px`。
- 主标题约 `28px`。
- 页面左右内边距约 `18px`。
- 时间线改为纵向（`tl-stage` 垂直排列）。
- 架构图改为纵向（箭头 `rotate(90deg)`）。
- 对比表格优先转为分组卡片（`.compare-mobile`）。
- 宽图允许接近屏幕边缘，但保留基本安全边距。
- `body` 不设 padding，仅 `.article` 保留 `padding: 32px 18px 60px`。
- 不使用悬浮侧边目录。
- 页面不能出现非预期的横向滚动。

---

## 12. 桌面端目录（TOC）

窗口宽度 ≥ 1100px 时显示，`position: fixed` 在正文右侧：

```html
<nav class="toc-sidebar">
  <div class="toc-title">本文目录</div>
  <ul class="toc-list">
    <li><a href="#">01 章节一</a></li>
    <li><a href="#">02 章节二</a></li>
  </ul>
</nav>
```

---

## 13. 色彩与品牌

| 变量 | 值 | 用途 |
|------|-----|------|
| `--zh-blue` | `#174A7C` | 链接、强调、表头 |
| `--zh-deep-blue` | `#06213D` | 主标题、h2、结论背景 |
| `--zh-cyan` | `#7ECDEB` | insight 竖线、强调高亮 |
| `--zh-light-blue` | `#DDEFF8` | 组件背景、表格表头 |
| `--zh-cream` | `#FFF9EF` | 页面背景 |
| `--zh-raccoon-gold` | `#D79A36` | eyebrow 标签、高亮标记 |
| `--zh-text` | `#1F2D3D` | 正文（非纯黑） |
| `--zh-muted` | `#6B7C8F` | 辅助文字、元信息 |
| `--zh-card` | `#FFFFFF` | 白色组件背景 |

使用规则：

- 深蓝用于主标题和最终结论。
- 主蓝用于链接、重要概念和结构元素。
- 青色用于 Insight 左边框和关键强调。
- 金色只用于标签、作者和少量当前状态。
- 浅蓝用于表头、流程背景和轻量卡片。
- 同一屏幕不要同时出现过多不同颜色。
- 不增加新的高饱和品牌色，除非文章主题确有必要。

---

## 14. 构建系统

所有 `.md` 源文件通过构建系统自动转换为 `src/blog/{slug}.html`。

### 目录结构

```
blog/           ← 原始素材库（markdown + 构建脚本 + 样式）
├── build-blog.js  构建脚本
├── _styles.css    博客文章共用样式（构建时内联）
├── template-guide.md
└── *.md           文章源文件

src/blog/       ← 构建输出（生成的 HTML，由 gh-pages 发布）
└── *.html
```

### 使用方式

```bash
npm run build:blog
```

### 转换规则

构建系统自动完成以下处理：

1. 从 Front Matter 生成标题区和元信息。
2. 自动为 h2、h3 生成稳定的锚点。
3. 根据 h2 生成桌面端目录。
4. 将 `[!INSIGHT]` 转为 `.insight`。
5. 将 `[!CONCLUSION]` 转为 `.conclusion`。
6. 将 `$$...$$` 转为 `.formula-box`。
7. 给宽表格和复杂图表增加 `.visual-wide`。
9. 为外部链接增加 `target="_blank" rel="noopener noreferrer"`。
10. 页面只保留一个 h1。
11. `date` 和 `updated` 使用固定值，**禁用 JS 动态生成**。
12. 页面标题格式统一为"文章标题 · zihao raccoon"。

> 时间线（timeline）和架构图（architecture）等复杂视觉组件，在 `.md` 中直接使用原始 HTML，构建系统原样保留。

---

## 15. 推荐 Markdown 骨架

```markdown
---
title: 文章标题
lead: 用一到两句话说明文章要回答的核心问题。
date: 2026-07-24
updated: 2026-07-24
author: zihao raccoon
reading_time: 6 分钟
category: 数据科学
tags:
  - 标签一
  - 标签二
slug: article-slug
status: draft
---

<!-- label: Context -->

## 01 为什么要讨论这个问题

用 100～250 字提出问题、背景和文章判断。

<!-- label: Framework -->

## 02 核心概念或分析框架

先用正文解释，再按需要加入表格、时间线或图表。

> [!INSIGHT]
> 这里放文章第一个关键判断。

<!-- label: Comparison -->

## 03 关键对比或判断

| 维度 | 方案 A | 方案 B |
|---|---|---|
| 核心方法 |  |  |
| 优势 |  |  |
| 局限 |  |  |

<!-- label: Architecture -->

## 04 方法、架构或业务案例

<!-- component: architecture -->

输入
→ 模型或方法
+ 外部上下文
→ 解释或判断
→ 业务输出

### 示例：具体业务场景

说明这个框架如何应用于真实问题。

<!-- label: Implication -->

## 05 这意味着什么

讨论适用条件、边界、风险和实践建议。

<!-- label: Summary -->

## 06 结论

> [!CONCLUSION]
> 用一段能够脱离全文单独成立的话总结核心判断。

补充一句适用边界或下一步方向。

## 参考与延伸阅读

1. [资料名称](https://example.com)
   一句话说明这份资料与文章的关系。

## 相关项目

<!-- project-card
label: Case Study
title: 项目名称
description: 一句话说明项目体现的能力
url: /projects/example/
-->
```

---

## 16. CSS 实现说明

所有样式已集成在 `time-series-evolution.html` 中。后续 Blog 页面可复用该文件的 `<style>` 块，提取为公共 CSS 文件或在每个页面内联。关键逻辑包括：

- `compare-mobile` / `compare-desktop` 的 `display` 切换
- 移动端 `@media` 断点（`max-width: 600px`）
- `visual-wide` 的负 margin 逻辑（`min-width: 820px`）
- `toc-sidebar` 的 `position: fixed`（`min-width: 1100px`）

---

## 17. 发布前检查清单

### 内容

- [ ] 标题是否明确表达主题？
- [ ] 导语是否提出了具体问题？
- [ ] 开篇是否在 250 字内进入主题？
- [ ] 每个章节是否有明确作用？
- [ ] 文章是否给出了自己的判断，而不只是整理知识？
- [ ] 结论是否回答了开篇问题？
- [ ] 是否写清适用条件和边界？
- [ ] 外部事实是否有参考来源？

### 结构

- [ ] 是否只有一个主标题？
- [ ] 二级标题是否统一编号？
- [ ] 是否控制在 4～7 个主要章节？
- [ ] Insight 是否不超过 3 个？
- [ ] Conclusion 是否只有一个？
- [ ] 表格是否真的比正文更适合？
- [ ] 图表前后是否有解释？
- [ ] 是否包含参考资料？
- [ ] 是否可以连接相关 Portfolio 项目？

### 页面

- [ ] 日期是否为固定值？
- [ ] 阅读时长是否合理？
- [ ] 桌面端正文宽度是否舒适？
- [ ] 手机端正文是否仍为 16px？
- [ ] 表格和架构图是否完成移动端适配？
- [ ] 页面是否不存在横向溢出？
- [ ] 目录锚点是否正确？
- [ ] 上一篇和下一篇链接是否正确？
- [ ] 外部链接是否安全打开？
- [ ] 图片是否有 `alt` 文本？

---

## 18. 允许变化的部分

为了避免所有文章看起来像同一个模具，以下部分可以根据内容调整：

- 章节数量和标题。
- 是否使用时间线、公式、对比表格、架构图。
- 是否关联 Portfolio 项目。
- 个别主题的插图和数据可视化。
- Section Label 的英文词汇。

以下部分原则上保持一致：

- 顶部导航。
- 标题区结构（面包屑、标签、导语、元信息）。
- 字体、正文宽度和主色系统。
- 二级标题的编号方式。
- Insight 和 Conclusion 的视觉含义。
- 参考资料格式。
- 文章尾部导航（上一篇/返回/下一篇）。
- 移动端适配原则（正文 16px 不缩小、布局转换）。

---

## 19. 一句话标准

> 每篇 Blog 都应当是一篇以正文为主、以组件辅助、具有明确问题、个人判断、证据来源和 Portfolio 连接的正式文章。
