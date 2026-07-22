# API 对接文档 — 宏观多维度量化看板

> 版本：v1.0 | 更新：2026-07-21
> 用途：指导后续将 Mock 数据替换为真实宏观数据源

---

## 0. 快速接入流程

当前所有数据集中在 `src/data/mockData.ts`，由 Pinia store（`src/stores/dashboard.ts`）读取。
接入真实 API 时**只需改这一层**，组件无需改动：

```
真实 API / WebSocket
        ↓
src/data/api.ts   ← 新增：封装 fetch / ws 请求
        ↓
src/stores/dashboard.ts  ← 改：ref 初始化改为异步拉取
        ↓
所有组件（无需改动）
```

---

## 1. 数据维度与接口清单

| 维度 | 对应字段 | 接口路径（建议） | 推送方式 |
|------|----------|------------------|----------|
| 政治政策 | `DimensionScore.dimension=政治政策` | `GET /api/v1/macro/politics` | REST + 定时轮询 |
| 货币政策 | `货币政策` | `GET /api/v1/macro/monetary` | REST + 定时轮询 |
| 科技产业 | `科技产业` | `GET /api/v1/macro/industry` | REST + 定时轮询 |
| 供应链物流 | `供应链物流` | `GET /api/v1/macro/supply-chain` | REST + 定时轮询 |
| 地缘军事 | `地缘军事` | `GET /api/v1/macro/geopolitics` | WebSocket 实时 |
| 能源大宗 | `能源大宗` | `GET /api/v1/macro/energy` | REST + 定时轮询 |
| 自贸区 | `自贸区` | `GET /api/v1/macro/trade-zone` | REST + 定时轮询 |
| 虚拟货币 | `虚拟货币` | `GET /api/v1/macro/crypto` | WebSocket 实时 |

---

## 2. 核心数据结构（契约）

### 2.1 多维度评分卡 `ScoreCardData`
```typescript
interface DimensionScore {
  dimension: string   // 维度名（见 RadarDimension 常量）
  label: string       // 展示标签，如 "地缘"
  value: number       // 0-1 综合评分
  trend: number       // -1~1 变化趋势
  weight: number      // 0-1 权重
}
interface ScoreCardData {
  id: string
  name: string        // 标的/板块名
  category: string    // 分类
  overallScore: number// 0-1
  dimensions: DimensionScore[]  // 8 维度
  trendChart?: number[]        // 迷你折线，值 0-1
  tags: string[]
  updateAt: string    // ISO 或 'YYYY-MM-DD HH:mm'
  riskLevel: 'low' | 'medium' | 'high'
}
```

**请求示例**
```
GET /api/v1/scores?sector=科技产业
→ 200 OK
[
  {
    "id": "sc-1",
    "name": "半导体板块",
    "category": "科技产业",
    "overallScore": 0.71,
    "dimensions": [
      { "dimension": "政治政策", "label": "政治", "value": 0.68, "trend": 0.12, "weight": 0.15 },
      ...
    ],
    "trendChart": [0.5, 0.55, 0.52, 0.6, 0.65, 0.63, 0.71],
    "tags": ["国产替代", "高景气"],
    "updateAt": "2026-07-21 09:12",
    "riskLevel": "medium"
  }
]
```

### 2.2 地图标记 `MapMarker`
```typescript
interface MapMarker {
  id: string
  name: string
  lat: number         // 纬度
  lng: number         // 经度
  type: 'military' | 'trade_zone' | 'port' | 'conflict' | 'energy'
  status: 'active' | 'warning' | 'critical'
  value?: number      // 0-1 强度
  description: string
}
```
```
GET /api/v1/map/markers
→ [{ "id":"m1", "name":"台海区域", "lat":24.5, "lng":120.5, "type":"conflict", "status":"critical", "value":0.85, "description":"..." }]
```

### 2.3 推演逻辑 `LogicFlow`
```
GET /api/v1/logic/{targetId}
→ { "id":"lf-1", "targetName":"半导体设备板块", "stages":[...], "conclusion":"...", "updatedAt":"..." }
```

### 2.4 资讯流 `NewsItem`
```
GET /api/v1/news?limit=20
→ [{ "id":"n1", "title":"...", "source":"央行", "time":"09:05", "category":"policy", "importance":"high", "tags":["货币"] }]
```

### 2.5 大宗商品 `CommodityPrice`
```
GET /api/v1/commodities
→ [{ "id":"c1", "name":"黄金", "symbol":"XAU", "price":2408.5, "change":1.24, "unit":"美元/盎司" }]
```

### 2.6 标的池 `TargetItem`
```
GET /api/v1/targets
→ [{ "id":"t1", "code":"688981", "name":"中芯国际", "price":58.2, "change":2.8, "score":0.71, "sector":"半导体" }]
```

---

## 3. WebSocket 实时协议（预留）

用于地缘军事、虚拟货币、行情等高频更新。连接后服务端主动推送增量。

```json
// 客户端 → 服务端：订阅
{ "type": "subscribe", "channels": ["geopolitics", "crypto", "ticker"] }

// 服务端 → 客户端：维度评分更新
{
  "type": "score_update",
  "cardId": "sc-1",
  "dimensions": { "地缘军事": 0.47, "虚拟货币": 0.32 },
  "ts": 1753065600
}

// 服务端 → 客户端：地图标记更新
{ "type": "marker_update", "id": "m1", "value": 0.88, "status": "critical" }

// 服务端 → 客户端：行情 tick
{ "type": "tick", "symbol": "BTC", "price": 72150, "change": 3.42 }
```

**前端接入点**：替换 `src/stores/dashboard.ts` 中的 `simulateRealtime()` 定时器：
```typescript
const ws = new WebSocket(import.meta.env.VITE_WS_URL)
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (msg.type === 'score_update') applyScoreUpdate(msg)
  if (msg.type === 'marker_update') applyMarkerUpdate(msg)
}
```

---

## 4. 环境变量

在 `dashboard/.env` 中配置：
```
VITE_API_BASE=https://your-api.example.com
VITE_WS_URL=wss://your-api.example.com/ws
```

---

## 5. 推荐数据源（外部）

| 维度 | 推荐源 |
|------|--------|
| 货币政策 | 央行官网 / FRED / 各央行 API |
| 地缘军事 | GDELT / ACLED 事件数据库 |
| 能源大宗 | EIA / 上海钢联 / 交易所行情 |
| 虚拟货币 | CoinGecko / CoinMarketCap API |
| 供应链物流 | 联合国 Comtrade / 航运 BDIndex |
| 自贸区 | 商务部公报 / 海关数据 |
| 产业趋势 | 行业研报聚合 / 万得 / 东方财富 |

> 所有外部源接入前需确认授权与频率限制，建议加一层缓存代理避免触发限流。
