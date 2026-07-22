# 宏观多维度量化金融看板 — 技术方案文档

> 版本：v1.0 | 更新：2026-07-21
> 项目类型：暗色大屏数据可视化网站（个人资产配置 / 宏观趋势跟踪）

---

## 1. 技术选型

| 层 | 技术 | 版本 | 选型理由 |
|----|------|------|----------|
| 前端框架 | Vue 3 | ^3.5 | 组合式 API + `<script setup>`，开发体验好、响应式精准 |
| 语言 | TypeScript | ^5.6 | 全量类型约束，量化数据模型强类型 |
| 构建 | Vite | ^7 | 秒级冷启动、Rollup/Rolldown 打包、原生 ESM |
| 状态管理 | Pinia | ^3 | 轻量、DevTools 友好、适合大屏全局状态 |
| 可视化 | ECharts | ^5.6 | 雷达图 / 地图 / 折线 / 散点，覆盖全部图表需求 |
| 地图底座 | 阿里 DataV GeoJSON | 100000_full | 中国行政区边界数据，配合 ECharts geo 渲染（ECharts 5 已不内置中国地图） |
| 样式 | Tailwind CSS v4 | ^4 | `@theme` 令牌化、暗色主题、原子类快速搭大屏 |
| 图标 | 项目锁定 SVG 描边图标（BaseIcon.vue） | — | P0 规则：禁止 emoji，统一一套可缩放描边图标 |
| 实时通信 | WebSocket（预留） | — | 当前用定时器模拟，接入后替换 `simulateRealtime` |

> 地图组件也可用 Mapbox / 高德地图 API 替换，只需在 `MacroMap.vue` 中替换渲染层，GeoJSON 数据源不变。

---

## 2. 目录结构

```
dashboard/
├── public/
│   └── china.geo.json              # 中国地图 GeoJSON 边界数据
├── src/
│   ├── assets/styles/
│   │   └── main.css                # 深空蓝设计系统 + Tailwind 令牌 + 通用 panel 样式
│   ├── components/                 # 看板组件（单一职责，单文件 ≤300 行）
│   │   ├── BaseIcon.vue            # 锁定 SVG 图标库（P0 规则）
│   │   ├── TopNavBar.vue           # 顶部导航 + LIVE 状态 + 时钟
│   │   ├── MacroMap.vue            # 宏观地缘地图（ECharts geo + 标记弹窗）
│   │   ├── RadarChart.vue          # 多维度雷达图（政治/货币/产业/供应链/加密…）
│   │   ├── ScoreCard.vue           # 量化评分卡（综合分 + 迷你趋势 + 雷达联动）
│   │   ├── LogicFlow.vue           # 阶段化推演逻辑卡片
│   │   ├── NewsTicker.vue          # 底部滚动资讯流（新闻+大宗+标的）
│   │   └── TargetPool.vue          # 相关标的池列表（评分环）
│   ├── stores/
│   │   └── dashboard.ts            # Pinia 全局状态（选中态 / 数据引用 / 实时模拟）
│   ├── types/
│   │   └── index.ts                # 全量 TypeScript 数据模型
│   ├── data/
│   │   └── mockData.ts             # Mock 数据源（API 接入时整体替换）
│   ├── utils/
│   │   └── chartOptions.ts         # ECharts option 构造函数（雷达/迷你线/地图）
│   ├── App.vue                     # 主布局：顶栏 + 三栏 + 底部 ticker
│   └── main.ts                     # 入口（Pinia 装配）
├── docs/
│   ├── ARCHITECTURE.md             # 本文档
│   └── API_GUIDE.md                # API 对接文档
├── index.html
├── vite.config.ts
└── tsconfig.app.json
```

---

## 3. 设计系统（深空蓝科技主题）

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-space-950/900/850` | `#050b14` / `#0a1628` / `#0d1f36` | 背景层级 |
| `--color-cyan-glow` | `#00d4ff` | 主高亮（青蓝） |
| `--color-blue-accent` | `#3b82f6` | 次高亮（科技蓝） |
| `--color-up / --color-down` | `#22d3a8` / `#ff5c7c` | 涨 / 跌 |
| `--color-text-bright/dim/mute` | `#e8f4ff` / `#7da0c4` / `#4a6685` | 文字层级 |

- 面板基类：`.panel`（玻璃拟态 + 描边 + 发光边框 `.glow-border`）
- 布局断点：`lg`（≥1024）三栏大屏，`col-span-12` 移动端堆叠
- **P0 红线**：禁止 emoji 图标、禁止紫粉渐变、禁止 AI 模板味文案/硬编码色值

---

## 4. 核心组件职责

| 组件 | 数据输入 | 交互 |
|------|----------|------|
| MacroMap | `markerList` + `regionList` + `china.geo.json` | 悬停 tooltip、点击标记弹窗、roam 缩放 |
| RadarChart | `selectedCard.dimensions` | 随选中卡片联动重绘 |
| ScoreCard | `scoreCardList[]` | 点击 → `store.selectCard` → 雷达图联动 |
| LogicFlow | `logicFlowList[0]` | 阶段状态可视化（completed/current/pending） |
| NewsTicker | `newsList + commodityList + targetList` | 无缝滚动，悬停暂停 |
| TargetPool | `targetList` | 评分环 + 涨跌色 |

---

## 5. 后续可优化项

- ECharts 按需引入（tree-shaking）可将包体从 1.2MB 降至 ~400KB
- 地图可升级为 Mapbox / 高德，支持 3D 地形与轨迹动画
- WebSocket 接入后移除 `simulateRealtime` 定时器
- 移动端 H5 可拆为独立路由，地图降级为静态缩略图
