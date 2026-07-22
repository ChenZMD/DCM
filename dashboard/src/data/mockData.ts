import {
  RadarDimension,
  type ScoreCardData,
  type MapMarker,
  type RegionInfo,
  type LogicFlow,
  type NewsItem,
  type CommodityPrice,
  type TargetItem,
} from '@/types'

// ============================================
// Mock 数据源
// 实际接入时：将以下数据替换为 API 请求返回结果即可
// 所有接口契约见 docs/API_GUIDE.md
// ============================================

/** 多维度评分卡片数据 */
export const scoreCards: ScoreCardData[] = [
  {
    id: 'sc-1',
    name: '半导体板块',
    category: '科技产业',
    overallScore: 0.71,
    dimensions: [
      { dimension: RadarDimension.POLITICS, label: '政治', value: 0.68, trend: 0.12, weight: 0.15 },
      { dimension: RadarDimension.MONETARY, label: '货币', value: 0.55, trend: -0.05, weight: 0.1 },
      { dimension: RadarDimension.INDUSTRY, label: '产业', value: 0.88, trend: 0.18, weight: 0.2 },
      { dimension: RadarDimension.SUPPLY_CHAIN, label: '供应链', value: 0.62, trend: 0.04, weight: 0.15 },
      { dimension: RadarDimension.GEO_POLITICS, label: '地缘', value: 0.45, trend: -0.08, weight: 0.15 },
      { dimension: RadarDimension.ENERGY, label: '能源', value: 0.7, trend: 0.06, weight: 0.1 },
      { dimension: RadarDimension.TRADE_ZONE, label: '自贸区', value: 0.8, trend: 0.1, weight: 0.05 },
      { dimension: RadarDimension.CRYPTO, label: '加密', value: 0.3, trend: -0.15, weight: 0.1 },
    ],
    trendChart: [0.5, 0.55, 0.52, 0.6, 0.65, 0.63, 0.71],
    tags: ['国产替代', '高景气', '政策利好'],
    updateAt: '2026-07-21 09:12',
    riskLevel: 'medium',
  },
  {
    id: 'sc-2',
    name: '新能源整车',
    category: '科技产业',
    overallScore: 0.67,
    dimensions: [
      { dimension: RadarDimension.POLITICS, label: '政治', value: 0.72, trend: 0.08, weight: 0.15 },
      { dimension: RadarDimension.MONETARY, label: '货币', value: 0.6, trend: 0.02, weight: 0.1 },
      { dimension: RadarDimension.INDUSTRY, label: '产业', value: 0.85, trend: 0.14, weight: 0.2 },
      { dimension: RadarDimension.SUPPLY_CHAIN, label: '供应链', value: 0.75, trend: 0.09, weight: 0.15 },
      { dimension: RadarDimension.GEO_POLITICS, label: '地缘', value: 0.58, trend: 0.03, weight: 0.15 },
      { dimension: RadarDimension.ENERGY, label: '能源', value: 0.9, trend: 0.12, weight: 0.1 },
      { dimension: RadarDimension.TRADE_ZONE, label: '自贸区', value: 0.65, trend: 0.05, weight: 0.05 },
      { dimension: RadarDimension.CRYPTO, label: '加密', value: 0.35, trend: -0.1, weight: 0.1 },
    ],
    trendChart: [0.62, 0.6, 0.64, 0.66, 0.63, 0.68, 0.67],
    tags: ['出海', '智能化', '价格战'],
    updateAt: '2026-07-21 09:10',
    riskLevel: 'medium',
  },
  {
    id: 'sc-3',
    name: '黄金 ETF',
    category: '能源大宗',
    overallScore: 0.42,
    dimensions: [
      { dimension: RadarDimension.POLITICS, label: '政治', value: 0.4, trend: -0.04, weight: 0.15 },
      { dimension: RadarDimension.MONETARY, label: '货币', value: 0.5, trend: 0.06, weight: 0.1 },
      { dimension: RadarDimension.INDUSTRY, label: '产业', value: 0.3, trend: -0.02, weight: 0.2 },
      { dimension: RadarDimension.SUPPLY_CHAIN, label: '供应链', value: 0.35, trend: -0.03, weight: 0.15 },
      { dimension: RadarDimension.GEO_POLITICS, label: '地缘', value: 0.7, trend: 0.15, weight: 0.15 },
      { dimension: RadarDimension.ENERGY, label: '能源', value: 0.6, trend: 0.08, weight: 0.1 },
      { dimension: RadarDimension.TRADE_ZONE, label: '自贸区', value: 0.45, trend: 0.01, weight: 0.05 },
      { dimension: RadarDimension.CRYPTO, label: '加密', value: 0.38, trend: -0.12, weight: 0.1 },
    ],
    trendChart: [0.45, 0.43, 0.44, 0.41, 0.4, 0.43, 0.42],
    tags: ['避险', '降息预期', '高位震荡'],
    updateAt: '2026-07-21 09:08',
    riskLevel: 'low',
  },
  {
    id: 'sc-4',
    name: '比特币',
    category: '虚拟货币',
    overallScore: 0.57,
    dimensions: [
      { dimension: RadarDimension.POLITICS, label: '政治', value: 0.5, trend: 0.05, weight: 0.15 },
      { dimension: RadarDimension.MONETARY, label: '货币', value: 0.65, trend: 0.1, weight: 0.1 },
      { dimension: RadarDimension.INDUSTRY, label: '产业', value: 0.55, trend: 0.07, weight: 0.2 },
      { dimension: RadarDimension.SUPPLY_CHAIN, label: '供应链', value: 0.45, trend: -0.02, weight: 0.15 },
      { dimension: RadarDimension.GEO_POLITICS, label: '地缘', value: 0.6, trend: 0.08, weight: 0.15 },
      { dimension: RadarDimension.ENERGY, label: '能源', value: 0.4, trend: -0.05, weight: 0.1 },
      { dimension: RadarDimension.TRADE_ZONE, label: '自贸区', value: 0.7, trend: 0.12, weight: 0.05 },
      { dimension: RadarDimension.CRYPTO, label: '加密', value: 0.92, trend: 0.2, weight: 0.1 },
    ],
    trendChart: [0.48, 0.52, 0.5, 0.55, 0.53, 0.58, 0.57],
    tags: ['减半周期', '机构增持', '高波动'],
    updateAt: '2026-07-21 09:05',
    riskLevel: 'high',
  },
]

/** 地图标记点 */
export const mapMarkers: MapMarker[] = [
  { id: 'm1', name: '台海区域', lat: 24.5, lng: 120.5, type: 'conflict', status: 'critical', value: 0.85, description: '区域军事活动频繁，关注局势变化' },
  { id: 'm2', name: '南海航运线', lat: 15.0, lng: 115.0, type: 'port', status: 'warning', value: 0.6, description: '主要航运通道，集装箱吞吐量下降3%' },
  { id: 'm3', name: '上海自贸区', lat: 31.2, lng: 121.5, type: 'trade_zone', status: 'active', value: 0.78, description: '跨境贸易便利化政策落地，通关效率提升' },
  { id: 'm4', name: '霍尔果斯口岸', lat: 44.2, lng: 80.4, type: 'port', status: 'active', value: 0.7, description: '中欧班列枢纽，货运量同比增长12%' },
  { id: 'm5', name: '中东油气带', lat: 26.0, lng: 48.0, type: 'energy', status: 'warning', value: 0.55, description: '原油产量调整，地缘溢价上升' },
  { id: 'm6', name: '北极航线', lat: 75.0, lng: 60.0, type: 'port', status: 'active', value: 0.4, description: '通航窗口延长，物流成本下降' },
  { id: 'm7', name: '粤港澳大湾区', lat: 22.5, lng: 114.0, type: 'trade_zone', status: 'active', value: 0.82, description: '科创走廊建设加速，跨境资本流动活跃' },
  { id: 'm8', name: '波罗的海', lat: 58.0, lng: 19.0, type: 'conflict', status: 'warning', value: 0.5, description: '航运保险费率小幅上行' },
]

/** 区域信息 */
export const regions: RegionInfo[] = [
  {
    name: '华东',
    code: 'HD',
    score: 0.78,
    highlights: ['上海自贸区扩容', '半导体国产化提速', '跨境资本流入'],
    markers: [mapMarkers[2]],
  },
  {
    name: '华南',
    code: 'HN',
    score: 0.82,
    highlights: ['大湾区科创走廊', '港口吞吐回升', '新能源出口高增'],
    markers: [mapMarkers[6]],
  },
  {
    name: '西北',
    code: 'XB',
    score: 0.7,
    highlights: ['中欧班列枢纽', '能源通道安全', '边境贸易活跃'],
    markers: [mapMarkers[3]],
  },
]

/** 推演逻辑流 */
export const logicFlows: LogicFlow[] = [
  {
    id: 'lf-1',
    targetName: '半导体设备板块',
    stages: [
      {
        id: 1,
        title: '政策驱动',
        content: '国产化替代政策加码，大基金三期注资落地',
        status: 'completed',
        keyPoints: ['大基金三期 3440 亿', '设备招标加速', '税收优惠延续'],
        confidence: 0.88,
      },
      {
        id: 2,
        title: '产业验证',
        content: 'Q2 订单环比 +35%，关键设备验证通过率提升',
        status: 'current',
        keyPoints: ['订单能见度高', '良率突破', '客户扩容'],
        confidence: 0.76,
      },
      {
        id: 3,
        title: '估值兑现',
        content: '2026E PE 回落至 35x，机构目标价上修空间 20%',
        status: 'pending',
        keyPoints: ['估值合理', '北向增持', '盈利拐点'],
        confidence: 0.64,
      },
    ],
    conclusion: '综合评分 0.71，建议超配，止损线 -12%',
    updatedAt: '2026-07-21 09:00',
  },
]

/** 财经资讯流 */
export const newsItems: NewsItem[] = [
  { id: 'n1', title: '央行：适时降准降息，保持流动性合理充裕', source: '央行', time: '09:05', category: 'policy', importance: 'high', tags: ['货币', '流动性'] },
  { id: 'n2', title: '半导体设备国产化率突破 35%，订单能见度延至 Q4', source: '产业内参', time: '08:52', category: 'industry', importance: 'high', tags: ['半导体', '国产替代'] },
  { id: 'n3', title: '红海航运扰动再起，BDI 指数周涨 8.2%', source: '路透', time: '08:40', category: 'geopolitics', importance: 'medium', tags: ['航运', '地缘'] },
  { id: 'n4', title: '美联储鸽派信号强化，黄金站上 2400 美元', source: 'Bloomberg', time: '08:30', category: 'commodity', importance: 'high', tags: ['黄金', '降息'] },
  { id: 'n5', title: '新能源车出口同比 +42%，欧洲市占率创新高', source: '海关总署', time: '08:15', category: 'market', importance: 'medium', tags: ['新能源', '出海'] },
  { id: 'n6', title: '中东局势缓和，布伦特回落至 82 美元', source: '路透', time: '07:58', category: 'geopolitics', importance: 'medium', tags: ['原油', '地缘'] },
  { id: 'n7', title: '比特币突破 7.2 万美元，机构 ETF 净流入加速', source: 'CoinDesk', time: '07:45', category: 'market', importance: 'high', tags: ['BTC', 'ETF'] },
  { id: 'n8', title: '自贸区跨境贸易便利化新政落地，通关提速 40%', source: '商务部', time: '07:30', category: 'policy', importance: 'medium', tags: ['自贸区', '贸易'] },
]

/** 大宗商品价格 */
export const commodities: CommodityPrice[] = [
  { id: 'c1', name: '黄金', symbol: 'XAU', price: 2408.5, change: 1.24, unit: '美元/盎司' },
  { id: 'c2', name: '原油', symbol: 'WTI', price: 82.3, change: -0.85, unit: '美元/桶' },
  { id: 'c3', name: '铜', symbol: 'CU', price: 9420, change: 0.62, unit: '美元/吨' },
  { id: 'c4', name: '螺纹钢', symbol: 'RB', price: 3680, change: -1.15, unit: '元/吨' },
  { id: 'c5', name: '碳酸锂', symbol: 'LC', price: 91200, change: 2.31, unit: '元/吨' },
  { id: 'c6', name: '比特币', symbol: 'BTC', price: 72150, change: 3.42, unit: '美元' },
]

/** 标的池 */
export const targetPool: TargetItem[] = [
  { id: 't1', code: '688981', name: '中芯国际', price: 58.2, change: 2.8, score: 0.71, sector: '半导体' },
  { id: 't2', code: '300750', name: '宁德时代', price: 192.5, change: 1.2, score: 0.67, sector: '新能源' },
  { id: 't3', code: '002594', name: '比亚迪', price: 245.8, change: -0.5, score: 0.65, sector: '新能源' },
  { id: 't4', code: '518880', name: '黄金ETF', price: 5.62, change: 1.1, score: 0.42, sector: '大宗' },
  { id: 't5', code: 'BTC', name: '比特币', price: 72150, change: 3.42, score: 0.57, sector: '加密' },
  { id: 't6', code: '600519', name: '贵州茅台', price: 1480, change: 0.3, score: 0.52, sector: '消费' },
]

/** 维度标签映射 */
export const dimensionLabels: Record<RadarDimension, string> = {
  [RadarDimension.POLITICS]: '政治政策',
  [RadarDimension.MONETARY]: '货币政策',
  [RadarDimension.INDUSTRY]: '科技产业',
  [RadarDimension.SUPPLY_CHAIN]: '供应链物流',
  [RadarDimension.GEO_POLITICS]: '地缘军事',
  [RadarDimension.ENERGY]: '能源大宗',
  [RadarDimension.TRADE_ZONE]: '自贸区',
  [RadarDimension.CRYPTO]: '虚拟货币',
}
