import type { EChartsOption } from 'echarts'
import type { ScoreCardData, MapMarker } from '@/types'

const COLORS = {
  cyan: '#00d4ff',
  cyanBright: '#5cefff',
  blue: '#3b82f6',
  deepBlue: '#1e40af',
  up: '#22d3a8',
  down: '#ff5c7c',
  warn: '#fbbf24',
  textBright: '#f0f8ff',
  textDim: '#8fb3d4',
  line: '#1f3a52',
}

/**
 * 雷达图配置生成（增强版：发光描边 / 径向填充 / 更精致网格）
 * 基于政治/货币/产业/供应链/地缘/能源/自贸区/加密 多维度
 */
export function buildRadarOption(card: ScoreCardData): EChartsOption {
  const indicator = card.dimensions.map((d) => ({
    name: d.label,
    max: 1,
  }))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(8,18,34,0.96)',
      borderColor: 'rgba(0,212,255,0.35)',
      borderWidth: 1,
      textStyle: { color: COLORS.textBright, fontSize: 12 },
      padding: [8, 12],
      formatter: (p: any) => {
        const dim = card.dimensions[p.dataIndex]
        return `<b style="color:#5cefff">${dim.label}</b><br/>评分: ${(dim.value * 100).toFixed(0)}<br/>趋势: <span style="color:${dim.trend >= 0 ? COLORS.up : COLORS.down}">${(dim.trend * 100).toFixed(0)}%</span>`
      },
    },
    radar: {
      indicator,
      center: ['50%', '52%'],
      radius: '70%',
      splitNumber: 4,
      axisName: {
        color: '#aacdf0',
        fontSize: 11,
        fontWeight: 500,
        padding: [2, 4],
      },
      splitLine: {
        lineStyle: { color: 'rgba(0,212,255,0.08)', width: 1 },
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(16,40,68,0.15)', 'rgba(10,22,40,0.35)'],
        },
      },
      axisLine: {
        lineStyle: { color: 'rgba(0,212,255,0.12)' },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: card.dimensions.map((d) => d.value),
            name: card.name,
            symbol: 'circle',
            symbolSize: 5,
            lineStyle: {
              color: COLORS.cyan,
              width: 2.5,
              shadowBlur: 14,
              shadowColor: 'rgba(0,212,255,0.6)',
            },
            itemStyle: {
              color: COLORS.cyanBright,
              borderColor: '#ffffff',
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: COLORS.cyan,
            },
            areaStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.65,
                colorStops: [
                  { offset: 0, color: 'rgba(0,212,255,0.38)' },
                  { offset: 1, color: 'rgba(0,212,255,0.08)' },
                ],
              },
            },
          },
        ],
      },
    ],
  }
}

/**
 * 迷你折线图配置（卡片趋势，增强发光）
 */
export function buildMiniLineOption(data: number[], color: string): EChartsOption {
  const isUp = !data || data.length < 2 || data[data.length - 1] >= data[0]
  const c = color || (isUp ? COLORS.up : COLORS.down)
  return {
    backgroundColor: 'transparent',
    grid: { left: 0, right: 0, top: 2, bottom: 0 },
    xAxis: {
      type: 'category',
      show: false,
      data: (data || []).map((_, i) => i),
    },
    yAxis: { type: 'value', show: false, min: 0, max: 1 },
    series: [
      {
        type: 'line',
        data,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: c, width: 1.8, shadowBlur: 6, shadowColor: c },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: c + '45' },
              { offset: 1, color: c + '00' },
            ],
          },
        },
      },
    ],
  }
}

/**
 * 地图散点配色
 */
export function getMarkerColor(type: MapMarker['type']): string {
  switch (type) {
    case 'conflict': return COLORS.down
    case 'military': return COLORS.warn
    case 'trade_zone': return COLORS.cyan
    case 'port': return COLORS.blue
    case 'energy': return COLORS.up
    default: return COLORS.textDim
  }
}

export const CHART_COLORS = COLORS
