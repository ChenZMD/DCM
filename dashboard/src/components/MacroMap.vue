<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { useDashboardStore } from '@/stores/dashboard'
import { getMarkerColor } from '@/utils/chartOptions'
import BaseIcon from './BaseIcon.vue'

const store = useDashboardStore()
const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function typeLabel(t: string): string {
  const map: Record<string, string> = {
    conflict: '地缘冲突', military: '军事活动', trade_zone: '自贸区', port: '港口枢纽', energy: '能源设施',
  }
  return map[t] || t
}

function markerIcon(t: string): string {
  const map: Record<string, string> = {
    conflict: 'alert', military: 'shield', trade_zone: 'globe', port: 'map', energy: 'bolt',
  }
  return map[t] || 'map'
}

function regionNameMap(short: string): string {
  const map: Record<string, string> = {
    华东: '上海市', 华南: '广东省', 西北: '新疆维吾尔自治区',
  }
  return map[short] || short
}

async function loadMap() {
  try {
    const resp = await fetch('/china.geo.json')
    const geoJson = await resp.json()
    echarts.registerMap('china', geoJson as any)
    initChart()
  } catch (e) {
    console.error('地图数据加载失败', e)
  }
}

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })

  const points = store.markerList.map((m) => ({
    name: m.name,
    value: [m.lng, m.lat, m.value ?? 0.5],
    itemStyle: { color: getMarkerColor(m.type) },
    marker: m,
  }))

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(8,18,34,0.96)',
      borderColor: 'rgba(0,212,255,0.35)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: '#f0f8ff', fontSize: 12 },
      formatter: (p: any) => {
        if (p.data?.marker) {
          const m = p.data.marker
          const statusMap: Record<string, string> = { active: '正常', warning: '关注', critical: '危急' }
          return `<b style="color:#5cefff">${m.name}</b><br/>类型: ${typeLabel(m.type)}<br/>状态: ${statusMap[m.status]}<br/>强度: ${((m.value ?? 0) * 100).toFixed(0)}<br/><span style="color:#8fb3d4">${m.description}</span>`
        }
        return p.name
      },
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.2,
      center: [104, 35],
      itemStyle: {
        areaColor: {
          type: 'radial', x: 0.5, y: 0.5, r: 0.8,
          colorStops: [{ offset: 0, color: '#0d2137' }, { offset: 1, color: '#0a1628' }],
        },
        borderColor: 'rgba(0,212,255,0.3)',
        borderWidth: 0.8,
        shadowColor: 'rgba(0,212,255,0.2)',
        shadowBlur: 12,
      },
      emphasis: {
        itemStyle: { areaColor: 'rgba(30,64,169,0.45)', borderColor: '#00d4ff', borderWidth: 1.2 },
        label: { show: false },
      },
      regions: store.regionList.map((r) => ({
        name: regionNameMap(r.name),
        itemStyle: { areaColor: `rgba(0,212,255,${0.1 + r.score * 0.15})` },
      })),
    },
    series: [
      {
        name: '地缘标记',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: points,
        symbolSize: (val: any) => 8 + val[2] * 18,
        showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke', scale: 3.2, period: 4 },
        zlevel: 2,
      },
    ],
  }

  chart.setOption(option)
  chart.on('click', (params: any) => {
    if (params.data?.marker) store.selectMarker(params.data.marker)
  })
}

function handleResize() {
  chart?.resize()
}

onMounted(() => {
  loadMap()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<template>
  <div class="panel glow-border flex flex-col h-full relative">
    <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--color-slate-line)]/60">
      <div class="panel-title">
        <BaseIcon name="map" :size="16" class="text-[var(--color-cyan-glow)]" />
        宏观地缘地图
      </div>
      <div class="flex items-center gap-2.5 text-[10px]">
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full shadow-[0_0_6px_#ff5c7c]" style="background:#ff5c7c"></span><span class="text-[var(--color-text-mute)]">冲突</span></div>
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full shadow-[0_0_6px_#00d4ff]" style="background:#00d4ff"></span><span class="text-[var(--color-text-mute)]">自贸区</span></div>
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full shadow-[0_0_6px_#3b82f6]" style="background:#3b82f6"></span><span class="text-[var(--color-text-mute)]">港口</span></div>
        <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full shadow-[0_0_6px_#22d3a8]" style="background:#22d3a8"></span><span class="text-[var(--color-text-mute)]">能源</span></div>
      </div>
    </div>

    <div ref="chartRef" class="flex-1 min-h-[300px]"></div>

    <!-- 底部提示 -->
    <div class="absolute bottom-3 left-4 text-[10px] text-[var(--color-text-mute)] flex items-center gap-1.5 pointer-events-none">
      <BaseIcon name="trend" :size="12" class="text-[var(--color-cyan-soft)]" />
      点击地图标记点查看实时区域信息
    </div>

    <!-- 地图标记弹窗 -->
    <div
      v-if="store.mapModalOpen && store.selectedMarker"
      class="absolute inset-4 m-auto w-80 h-fit panel glow-border z-10 fade-up overflow-hidden"
    >
      <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[rgba(0,212,255,0.12)] to-transparent border-b border-[rgba(0,212,255,0.18)]">
        <div class="flex items-center gap-2">
          <BaseIcon :name="markerIcon(store.selectedMarker.type)" :size="18" :style="{ color: getMarkerColor(store.selectedMarker.type) }" />
          <span class="text-[14px] font-semibold text-[var(--color-text-bright)]">{{ store.selectedMarker.name }}</span>
        </div>
        <button class="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-mute)] hover:text-[var(--color-text-bright)] hover:bg-[rgba(16,40,68,0.6)] transition-colors" @click="store.closeMapModal()">
          <BaseIcon name="refresh" :size="14" />
        </button>
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2 mb-2.5">
          <span class="chip" :style="{ color: getMarkerColor(store.selectedMarker.type), borderColor: getMarkerColor(store.selectedMarker.type) + '55' }">{{ typeLabel(store.selectedMarker.type) }}</span>
          <span class="text-[10px] text-[var(--color-text-mute)]">{{ { active: '正常', warning: '关注', critical: '危急' }[store.selectedMarker.status] }}</span>
        </div>
        <p class="text-[12px] text-[var(--color-text-dim)] leading-relaxed mb-3.5">{{ store.selectedMarker.description }}</p>
        <div class="flex items-center justify-between text-[11px] mb-1.5">
          <span class="text-[var(--color-text-mute)]">实时强度</span>
          <span class="font-mono text-[var(--color-cyan-bright)] font-semibold">{{ ((store.selectedMarker.value ?? 0) * 100).toFixed(0) }}</span>
        </div>
        <div class="w-full h-1.5 rounded-full bg-[var(--color-space-800)] overflow-hidden">
          <div
            class="h-full rounded-full"
            :style="{ width: `${(store.selectedMarker.value ?? 0) * 100}%`, background: getMarkerColor(store.selectedMarker.type), boxShadow: '0 0 8px ' + getMarkerColor(store.selectedMarker.type) }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
