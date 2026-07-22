// ============================================
// 宏观多维度量化金融看板 - 类型定义
// ============================================

/** 雷达图维度常量 */
export const RadarDimension = {
  POLITICS: '政治政策',
  MONETARY: '货币政策',
  INDUSTRY: '科技产业',
  SUPPLY_CHAIN: '供应链物流',
  GEO_POLITICS: '地缘军事',
  ENERGY: '能源大宗',
  TRADE_ZONE: '自贸区',
  CRYPTO: '虚拟货币',
} as const

export type RadarDimension = typeof RadarDimension[keyof typeof RadarDimension]

/** 维度评分项 */
export interface DimensionScore {
  dimension: RadarDimension
  label: string
  value: number        // 0-1
  trend: number        // 变化趋势 -1~1
  weight: number       // 权重 0-1
}

/** 综合评分卡片数据 */
export interface ScoreCardData {
  id: string
  name: string          // 标的/板块名称
  category: string      // 分类标签
  overallScore: number  // 综合评分 0-1
  dimensions: DimensionScore[]
  trendChart?: number[] // 迷你折线图数据
  tags: string[]
  updateAt: string
  riskLevel: 'low' | 'medium' | 'high'
}

/** 地图标记点 */
export interface MapMarker {
  id: string
  name: string
  lat: number
  lng: number
  type: 'military' | 'trade_zone' | 'port' | 'conflict' | 'energy'
  status: 'active' | 'warning' | 'critical'
  value?: number
  description: string
}

/** 地图区域信息 */
export interface RegionInfo {
  name: string
  code: string
  score: number
  highlights: string[]
  markers: MapMarker[]
}

/** 推演阶段 */
export interface LogicStage {
  id: number
  title: string
  content: string
  status: 'completed' | 'current' | 'pending'
  keyPoints: string[]
  confidence: number   // 0-1
}

/** 推演逻辑流 */
export interface LogicFlow {
  id: string
  targetName: string
  stages: LogicStage[]
  conclusion: string
  updatedAt: string
}

/** 财经资讯条目 */
export interface NewsItem {
  id: string
  title: string
  source: string
  time: string
  category: 'policy' | 'market' | 'geopolitics' | 'industry' | 'commodity'
  importance: 'high' | 'medium' | 'low'
  tags: string[]
}

/** 大宗商品价格 */
export interface CommodityPrice {
  id: string
  name: string
  symbol: string
  price: number
  change: number       // 涨跌幅%
  unit: string
}

/** 标的池项目 */
export interface TargetItem {
  id: string
  code: string
  name: string
  price: number
  change: number
  score: number
  sector: string
}

/** 看板全局状态 */
export interface DashboardState {
  selectedRegion: RegionInfo | null
  selectedCard: ScoreCardData | null
  radarDimensions: RadarDimension[]
  currentTime: string
  isLive: boolean
  viewerCount: number
}
