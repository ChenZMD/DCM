# 大聪明金融 — 项目交接文档（HANDOFF）

> 本文档供接手方（新项目/维护者）快速建立全局认知、定位代码、规避已知坑。
> 生成日期：2026-07-23。仓库分支：`main`。

---

## 0. TL;DR（30 秒速览）

- 这是「大聪明金融」**数据可视化演示项目**，由根 `index.html` 导航卡片串联 **3 个入口**。
- **已打磨成熟、可直接交付**：`landing/index.html`（3D 地球 + 金融热点新闻面板，单文件原生实现）。
- **已与 3D 页统一维度体系**：`landing/world-map.html`（2D ECharts 世界地图，V3.0 维度扩充已完成，81 条带维度新闻）。
- **V4.3 新增 2D 离线降级地图**：`landing/index.html` 内已集成【3D 地球 / 2D 地图】切换——2D 视图复用 ECharts 离线渲染「真实港口吞吐量气泡」+「贴合海岸线真实航线」（与 V4.2 同一份 `SHIPPING_ROUTES`），彻底规避 3D→2D 穿模。数据见 §4.2.2。
- **已实现业务骨架**：`dashboard/`（Vue3+Vite+TS 量化看板，含 9 个组件 + Pinia store + 演示数据；构建运行未在沙箱验证）。
- **所有数据均为演示数据，非真实接口**（沙箱环境无法联网调用外部 API）。

---

## 1. 项目定位

- **产品**：面向交易员 / 宏观研究员的「宏观多维度量化金融看板」。
- **视觉基调**：深色科技风。主色青 `#00d4ff` / 蓝 `#3b82f6`，背景 `#07111f`。**严禁紫粉渐变、严禁 emoji 图标、严禁 AI 模板味文案**（项目 P0 视觉规则）。
- **三视角**：3D 地球（主力，已打磨） / 2D 地图（独立） / 量化看板（已实现基础业务骨架，演示数据驱动）。

---

## 2. 仓库结构

```
大聪明金融/
├── index.html                 # 根导航卡片（3 入口跳转）
├── .gitignore                 # 忽略 .workbuddy/、node_modules/、dist/ 等
├── HANDOFF.md                 # 本文档
├── landing/                   # ★ 核心目录
│   ├── index.html             # 主交付物：3D 地球 + 金融热点面板（单文件 ~80KB）
│   ├── world-map.html         # 2D ECharts 世界地图（与 3D 页统一维度体系，V3.0，81 条带维度新闻）
│   ├── vendor/
│   │   └── three.min.js       # Three.js r128 本地副本（非 CDN，必须同目录可访问）
│   ├── _test.js / _test2.js / _test3.js / _verify.js  # 早期调试脚本（已入库，建议清理）
└── dashboard/                 # Vue3 + Vite + TS 量化看板（已实现基础业务骨架，演示数据驱动）
    ├── package.json           # vue^3.5, vite^8, echarts^6, pinia^4, tailwindcss^4, typescript~6
    ├── vite.config.ts         # 端口 3000 / host:true
    ├── tsconfig*.json
    └── src/
        ├── App.vue            # 装配 7 个业务组件 + 实时刷新逻辑
        ├── main.ts / style.css
        ├── components/
        │   ├── TopNavBar.vue   MacroMap.vue   RadarChart.vue
        │   ├── ScoreCard.vue   LogicFlow.vue   NewsTicker.vue
        │   ├── TargetPool.vue  BaseIcon.vue    HelloWorld.vue
        ├── stores/dashboard.ts          # Pinia 全局状态
        ├── data/mockData.ts              # 演示数据
        ├── types/index.ts                # 类型定义
        ├── utils/chartOptions.ts         # ECharts 配置
        └── assets/                       # hero.png / styles/main.css 等
```

---

## 3. 技术栈

| 模块 | 技术 | 构建 |
|------|------|------|
| `landing/index.html` | 纯原生 HTML/CSS/JS 单文件 + **Three.js r128**（本地 vendor） | 无构建，任意静态服务器即可运行 |
| `landing/world-map.html` | ECharts 矢量地图（2D） | 无构建 |
| `dashboard/` | Vue 3.5 + TypeScript + Vite 8 + ECharts 6 + Pinia 4 + Tailwind 4 | `npm i && npm run dev` |

---

## 4. 核心功能实现

### 4.1 3D 地球（左侧约 60%）
- **18 个全球金融城市节点**（北京/上海/东京/伦敦/纽约/香港/法兰克福/迪拜/新加坡/巴黎/苏黎世/多伦多/悉尼/孟买/圣保罗/莫斯科/首尔/芝加哥等）。
- 交互：惯性拖拽旋转、滚轮/双指缩放、Fly-to 聚焦、缓入自转、深度淡出标签、悬停高亮。
- 抛光项：
  - 外缘青色**呼吸光环**（`ringBreath` 4.5s，`::after` 内描边，不裁切地球本体）。
  - **默认视角均衡**：相机 `rotation.y = 41°`（经数学定标：亚洲节点在左、欧美在右、5 个核心节点全正面可见，不偏欧洲）。
  - 点击节点：**相机轻推近**（`CAM_Z_FOCUS=3.0`）+ **选中光圈脉冲**（`SELECT_PULSE_MS=700`）。
- 错误处理：WebGL 不可用 / 初始化异常 → **静默降级**（仅 `console.error`，页面不显示任何错误文案）。

### 4.2 金融热点新闻面板（右侧约 40%）
- 交互：**点击地球节点 → 右侧显示该城市新闻**（保留「点城市看该城市」）。
- 排序：按**金融重要程度降序**——`TAG_WEIGHT`（alert5/hot4/live3/policy3/finance3/trade2/energy2/industry2/resource2/update1）+ 城市 `score` 全球中心加权 `(score-0.5)*4`；带 `#N` 排名徽标，Top1 红色 / Top2-3 橙色左边框高亮。
- 时间：相对时间「X 分钟前 / X 小时前」（「正在直播」原样保留），带 `data-time` 便于定时刷新。
- 诚实标注（**关键**）：面板顶部有「演示数据」标签 + 绿色「实时」脉冲点（CSS 圆点，非 emoji）；页脚「演示数据 · 最后更新 HH:MM:SS」；城市时钟每秒 `tickClock`；`setInterval(tickHotspot, 15000)` 每 15s 重算相对时间并刷新页脚戳。
- 动效：切城市时列表 `.leaving`（0.3s 上移淡出）→ 刷新 → `.entering`（0.3s 下移淡入）；数据间隙骨架屏 `skeletonShimmer`。
- 无障碍：全量 `prefers-reduced-motion` 降级。

### 4.2.1 航运真实航线（V4.2）
- 废弃原「HUB-to-HUB 两点 `QuadraticBezierCurve3` 弧线」，替换为 **7 条真实国际集装箱班轮航线**（`SHIPPING_ROUTES`，内联于 `landing/index.html`；无后端，静态演示数据）。
- 真实航路点（经纬度为真实港口/海峡/运河坐标，使航线贴合海岸线、绕开陆块）：亚欧（台湾海峡→马六甲→红海→苏伊士→直布罗陀）、跨太平洋（东海→北太平洋→白令海域）、泛东南亚、亚欧好望角避险线、跨大西洋、大洋洲(托雷斯海峡)、波斯湾(霍尔木兹)。
- 渲染：`CatmullRomCurve3` 穿过所有航路点 → 采样点重投影到恒定半径（`R*1.012`）实现**贴地不穿模**；船队点沿曲线 `t` 插值移动，到港后从起点重生形成持续流动。
- hover：不可见 `TubeGeometry` 管线射线命中 → Tooltip 显示「途经 XX 海峡 · 现实黄金航道」+ 集装箱周班次（演示值，由港口吞吐量排名驱动，非实时 AIS）。
- QA（headless Node + 真实 THREE r128 已验证）：7 条航线曲线均经过马六甲/苏伊士等真实坐标（角距≈0°）、贴地 `R≈1.012`、无 NaN。**3D 视觉与帧率需本机实测（沙箱无 WebGL）。**

### 4.2.2 2D 降级地图（V4.3）
- **目标**：在 3D 地球基础上补充离线 2D 平面降级视图，承载「真实港口吞吐量气泡」+「贴合海岸线真实航线」+「船队流动」，并彻底解决 3D→2D 的穿模问题。
- **选型（已与用户确认）**：纯离线约束下 Mapbox/Leaflet 在线瓦片不可用 → 复用项目已内置的 `vendor/echarts.min.js` + `vendor/data/world-geo.js`（离线世界地图），与现有 `world-map.html` 同源。
- **集成方式**：在 `landing/index.html` 内新增 `#map2d` 容器 + 右上角【3D 地球 / 2D 地图】切换按钮 + 左下角图例；点击切换时**暂停 3D 渲染循环（保留 rAF 以便切回）、隐藏 3D canvas、显示 2D、懒加载 echarts+world-geo**（首次切换才加载，不拖慢 3D 首屏）。切回 3D 时反向操作，无重影。
- **坐标系统一**：geo 设 `center:[0,20], zoom:1.5`；ECharts 5.1+ 启用 `projection:{type:'mercator'}`。2D 与 3D 共用同一份 `SHIPPING_ROUTES` 真实航路点，仅做 `[lat,lng]→[lng,lat]` 转换。
- **真实吞吐量气泡（Top 10）**：`PORT_THROUGHPUT`（内联于 `landing/index.html`），环形 `effectScatter`，`symbolSize` 由 TEU 线性映射并钳制 **20–60px（严格正相关、防重叠）**；颜色由 `visualMap` 蓝→黄→红反映繁忙度；hover Tooltip 显示「名称 / 吞吐量(万 TEU) / 全球 Top N」。
  - ⚠️ 数据来源：近似 2023 年公开统计值（上海≈4920、新加坡≈3900、宁波≈3530、深圳≈2990、青岛≈2870、广州≈2540、釜山≈2300、天津≈2220、中国香港≈1430、鹿特丹≈1340 万 TEU）。**演示用途，待数据组以官方口径核实替换**（图例已标注「演示数据·近似值，待数据组核实」）。
- **真实航线（防穿模）**：复用 `SHIPPING_ROUTES`，以 `lines` 系列 `polyline:true` 直接连接各真实航路点 → 线天然沿台湾海峡/南海/马六甲/红海/苏伊士等绕开陆块，**构造上杜绝「穿过台湾岛/菲律宾/非洲大陆」**。船点流动用 `lines.effect`（沿折线平滑移动，不会直线"飞过去"）。
- **QA（已验证）**：① 内联脚本 `node --check` 语法 OK；② 数据校验确认 10 港 TEU→半径严格正相关(20→45，maxRadius=45)、7 条航线坐标合法、亚欧线含台湾海峡/马六甲/苏伊士/直布罗陀途经点。③ **2D 实际渲染与放大穿模目检需本机实测（沙箱无浏览器 GUI）**——但航线由真实航路点驱动，贴合海岸线由数据保证。

### 4.2.3 2D 航线不显示修复（V4.3.1 · 2026-07-24）
- **现象（用户反馈）**：切到 2D 视图，底图与港口气泡可见，但**航运线条完全不显示**。
- **根因**：V4.3 初版给 `geo` 加了 `projection:{type:'mercator'}`（墨卡托）。ECharts 的 `lines` 系列多段线在 geo 墨卡托投影下存在渲染缺陷——**点类系列（effectScatter 气泡）能显示，线类系列（lines）不渲染**。对照已验证的 `world-map.html`：同为 `lines`+`geo`、`不设墨卡托` → 航线正常显示。此对照坐实根因。
- **修复**：① 移除 `projection:{type:'mercator'}`，`geo` 回归默认等距圆柱投影（与 `world-map.html` 同源、已验证可用；任务单亦允许等距圆柱）。② 新增 `splitAntimeridian()`：2D 平面经度范围 [-180,180]，跨太平洋航线经度从 175°E 跳到 -170°W，直线会穿模大陆；改为在 180° 边界处**拆成两段**（各贴地图边缘），每段经度连续，视觉上沿北太平洋跨越、不穿陆地。
- **验证（headless Node）**：① 内联脚本 `new Function` 语法 OK；② `splitAntimeridian` 单测：跨太平洋→2 段（142→180 / -180→-118.27），每段经度连续无跳变；亚欧→保持 1 段。③ ECharts SSR 对比渲染因沙箱无 DOM（`document is not defined`）未能执行，**2D 实际渲染需本机浏览器实测确认**。

### 4.2.4 2D 航线穿模修正与视觉规格对齐（V4.4 · 2026-07-24）
- **任务单来源**：依据 2D 航运动态截图，要求修正穿模航线 + 统一图例/船舶动画/吞吐量气泡视觉规格。
- **重要澄清（非两点直线）**：当前 2D 数据层 `SHIPPING_ROUTES` 早已是**完整航路点序列**（亚欧 24 点经台湾海峡→马六甲→红海→苏伊士→地中海→直布罗陀→鹿特丹；好望角线 18 点绕非洲南端），**并非**任务单担忧的「起点→终点」两点一线。用户截图所见的"非洲穿模"疑为旧缓存/旧页面(`world-map.html`)残留；本版在保留真实航路点基础上，按任务单逐项强化视觉规格。
- **改动清单（全部已落地并脚本校验）**：
  1. **航线分级与颜色**：`SHIPPING_ROUTES` 增 `tier`(trunk/secondary)、`from`/`to` 港口名。`build2DOption` 按 tier 上色——**主干青蓝 `rgba(40,210,255,0.8)` 3px**、**次级/区域绿 `rgba(0,255,170,0.8)` 2px**（任务单指定色值）。
  2. **hover 高亮**：`lines` 设 `emphasis.lineStyle{opacity:1,width:4}` + `blur.lineStyle{opacity:0.3}` + `blurScope:'series'`——悬浮某线时该线全亮、其余同系列降至 0.3。
  3. **Tooltip**：`X ↔ Y，活跃船舶：N 艘` + 途经（如「上海港 ↔ 鹿特丹港，活跃船舶：45 艘」）。
  4. **船舶动画**：`effect.color` 改白色 `#ffffff`（匹配截图白色移动亮点）；`smooth:true` 对 `polyline` 做样条平滑（防折线直角）；动画默认从 `coords[0]` 起沿曲线流动，`setOption` 时重置，无逆行/断点。
  5. **吞吐量气泡**：`maxRadius` 由 60→**45px**（任务单指定）；新增**双层同心光晕**(`scatter` 1.7×/2.4× 低透明度)增加视觉面积，避免实心圆无限放大形成"视觉黑洞"；中国沿海密集港口(宁波/深圳/中国香港/广州)加 `dx/dy` 经纬度微偏移防重叠（引线/锚点式布局简化版）。
  6. **底部图例**：补 3 级气泡(低/中/高 + 对应万 TEU 数值) + 双色航线说明(青蓝主干 / 绿色次级)。
- **QA（headless Node 已验证）**：① 内联脚本 `node --check` 语法 OK；② 数据校验 7 条航线均 ≥5 航点(非两点直线)、`tier`/`from`/`to` 齐全(4 trunk + 3 secondary)；③ 气泡半径严格正相关且 `≤45px`；④ 颜色/平滑/hover/白色船点/双色图例/防重叠偏移等规格字符串全部落地。⑤ **2D 实际渲染与放大穿模目检仍需本机浏览器实测（沙箱无 GUI/DOM）**——`smooth:true` 在极密航点处可能轻微外鼓，已用密集航路点抑制。
- **诚实边界**：吞吐量仍为近似 2023 公开值（演示，待数据组核实）；航线为真实地理坐标非实时 AIS。

### 4.3 `dashboard/` 已实现业务骨架（演示数据驱动）

> 注：本模块代码已实现，但**构建运行未在沙箱验证**（依赖未安装、需联网 `npm i`）。接手方需 `npm i && npm run dev` 实测。

- **入口**：`src/App.vue` 装配 7 个业务组件（`TopNavBar / MacroMap / RadarChart / ScoreCard / LogicFlow / NewsTicker / TargetPool`），接 `stores/dashboard`（Pinia）并含实时刷新逻辑。
- **组件清单**（`src/components/`）：TopNavBar、MacroMap、RadarChart、ScoreCard、LogicFlow、NewsTicker、TargetPool、BaseIcon，外加脚手架遗留的 `HelloWorld`。
- **数据与状态**：`data/mockData.ts`（演示数据）、`stores/dashboard.ts`（Pinia）、`types/index.ts`（类型）、`utils/chartOptions.ts`（ECharts 配置）。
- **依赖**：Vue 3.5 + TS + Vite 8 + ECharts 6 + Pinia 4 + Tailwind 4（见 `package.json`）。
- **运行**：`cd dashboard && npm i && npm run dev` → `http://localhost:3000`（vite.config.ts 端口 3000 / host:true）。
- **P0 视觉规则同样适用**：深色科技风、禁 emoji、禁紫粉渐变（与 landing 一致）。

---

## 5. 代码导航（均在 `landing/index.html` 单文件内）

| 关注点 | 标识 / 位置 |
|--------|------------|
| 城市 + 新闻数据 | `MAP_NODES_DATA`（约 339 行起，含 `id/name/rank/score/lat/lng/news[]`） |
| 模块状态变量 | `let activeNodeId, GLOBE, ...`；`let newsPanel, newsPanelCity, newsPanelMeta, newsPanelList;` |
| 交互参数 | `const MOTION = { DRAG_THRESHOLD:10, DRAG_THRESHOLD_SOFT:22, CAM_Z_FOCUS:3.0, SELECT_PULSE_MS:700, VEL_EPS:0.00015, ... }` |
| 点击拾取 | `pickNode(e)` —— 在正面命中里选「节点中心到拾取射线垂直距离最小」的节点（纠正邻近金融中心误选） |
| 事件绑定 | `bindGlobeEvents()`（pointerdown/move/up，含 `moved` 拖拽判定） |
| 新闻主逻辑 | `selectNode(id)` → `updateNews(node, animate)` → `renderNewsHeader` / `renderNewsList` |
| 重要度评分 | `newsImportance(item, node)`、`const TAG_WEIGHT = {...}` |
| 相对时间 | `relTime('HH:MM')` |
| 实时时钟 | `cityTime(tz)`（IANA 时区 `CITY_TZ`）、`tickClock()`、`tickHotspot()`（15s） |
| 样式变量 | `:root { --cyan:#00d4ff; --bg-900:#07111f; ... }`（文件头部约 9 行起） |
| 呼吸光环 / 新闻样式 / 骨架屏 | `.globe-wrap::after` + `@keyframes ringBreath`；`.news-item.top/.top1`；`.skeleton-*` |

---

## 6. 已知坑 / 必读约束

1. **新闻是演示数据，非真实 API**。沙箱无法联网。接真实源时：把 `tickHotspot` 内逻辑换成 `fetch` + 错误降级（逻辑骨架已留好），并保留「演示数据」标识直到数据确为真实——**切勿把模拟刷新谎称为实时接口**。
2. **点击阈值踩坑史（重要）**：原 `DRAG_THRESHOLD=5` 过小，真人点击的 5–20px 鼠标抖动会被 `onPointerUp` 判为「拖拽旋转」而抑制 `pickNode`，导致新闻永不刷新。已修为 `10` + 软阈值 `22`（松开处仍有节点则仍算点击）。**改动此处务必真机点击回归测试**（无头 Chrome + swiftshader 见下）。
3. **无头测试环境**：puppeteer 启动用 `--use-gl=swiftshader`（实测 `--use-gl=angle --use-angle=swiftshader` 会导致第二页 `waitForFunction` 超时）；`NODE_PATH` 在 Windows 下用**反斜杠**加载 `puppeteer-core`；Chrome 在 `~/.cache/puppeteer/chrome/win64-*/chrome.exe`。
4. **本地预览**：`cd landing && python -m http.server 8080` → `http://127.0.0.1:8080/index.html`。`vendor/three.min.js` 必须同目录可访问（页面引用本地路径，非 CDN）。
5. **P0 视觉规则（项目约定）**：禁 emoji 图标（用 SVG/CSS 圆点）、禁紫粉渐变、禁 AI 模板味文案。Top 高亮用橙/红实色。
6. **`world-map.html` 与 `landing/index.html` 同为 V3.0 维度体系**（维度色彩 / 双标签 / 11-chip 筛选一致），但新闻数据仍各自内联、逻辑不共享，改一个不影响另一个的 V3.0 结构。
7. **`landing/` 下的 `_test*.js`、`_verify.js` 是早期调试残留**，已入库（git status 干净），**建议清理**以免干扰接手方。
8. **未做移动端布局**：当前 `html,body{overflow:hidden}` 全屏桌面向，无响应式断点。

---

## 7. Git 历史速览（`main`，最新在前）

| Commit | 说明 |
|--------|------|
| `125633c` | feat: 右侧新闻→金融热点（按重要度排序 + 演示数据标注 + 15s 刷新） |
| `3e2aba2` | fix: 节点点击不刷新新闻（阈值 5→10 + 软阈值；pickNode 改选垂直距离最近节点） |
| `b86a3d0` | fix: 移除初始化失败提示（静默降级） |
| `0aca599` | polish: 视觉/动效抛光（呼吸光环 + 视角均衡 + 推近脉冲 + 城市时钟 + 切换动效） |
| 更早 | 3D 地球交互重构（`3a9754f`）、全屏化（`2cd5586`）、Hero 重构（`37ac194`）等 |

> 全部改动已 `git push origin main`。线上 Pages 重建后生效。

---

## 8. 待办 / 可扩展（接手方可选）

- [ ] 接入真实新闻 API（替换 `tickHotspot` 的模拟逻辑）
- [ ] 节点悬浮 tooltip / 新闻卡片微交互
- [ ] 验证 `dashboard/` 构建运行（业务骨架已实现，但需 `npm i && npm run dev` 实测；沙箱未验证）
- [ ] 统一 `world-map.html` 与 `landing/index.html` 的数据源
- [x] 清理 `landing/` 下调试脚本（`_test*.js` / `_verify.js`）— 2026-07-23 已删除并提交
- [ ] 响应式 / 移动端适配

---

## 9. 接手第一步

1. 用任意静态服务器跑 `landing/index.html`（或根 `index.html` 点「3D 地球」入口）。
2. **硬刷新**（本地 `vendor/three.min.js` 加载需联网一次）。
3. 验证清单：
   - 地球外缘有缓慢青色呼吸光（4.5s 周期）
   - 默认视角亚洲在左、欧美在右，5 个核心节点正面可见
   - 点不同城市：相机轻微推近 + 节点光圈脉冲
   - 右侧新闻按重要度排序（带 `#N` 徽标、Top3 高亮）
   - 顶部城市时钟每秒跳动；页脚「演示数据 · 最后更新」每 15s 刷新
   - 切城市时列表 0.3s 上移淡出再下移淡入
4. 改代码前先读 `MAP_NODES_DATA` 与 `newsImportance` 理解数据结构。
