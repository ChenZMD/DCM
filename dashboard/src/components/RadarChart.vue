<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import * as echarts from 'echarts'
import { useDashboardStore } from '@/stores/dashboard'
import { buildRadarOption } from '@/utils/chartOptions'
import BaseIcon from './BaseIcon.vue'

const store = useDashboardStore()
const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

const card = computed(() => store.selectedCard)

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  updateChart()
}

function updateChart() {
  if (!chart || !card.value) return
  chart.setOption(buildRadarOption(card.value))
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

function handleResize() {
  chart?.resize()
}

watch(() => card.value?.id, () => updateChart())
</script>

<template>
  <div class="panel glow-border flex flex-col h-full">
    <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--color-slate-line)]/60">
      <div class="panel-title">
        <BaseIcon name="radar" :size="16" class="text-[var(--color-cyan-glow)]" />
        多维度量化评分雷达
      </div>
      <div class="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[rgba(16,40,68,0.5)] border border-[rgba(0,212,255,0.15)]">
        <span class="text-[10px] text-[var(--color-text-mute)]">标的</span>
        <span class="text-[12px] font-semibold text-[var(--color-cyan-bright)]">{{ card?.name }}</span>
      </div>
    </div>

    <!-- 雷达图 -->
    <div ref="chartRef" class="flex-1 min-h-[200px]"></div>

    <!-- 维度明细 -->
    <div class="px-3 pb-3 grid grid-cols-2 gap-1.5 max-h-[130px] overflow-y-auto">
      <div
        v-for="dim in card?.dimensions"
        :key="dim.label"
        class="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[rgba(10,22,40,0.5)] border border-[rgba(31,58,82,0.5)]"
      >
        <span class="text-[11px] text-[var(--color-text-dim)]">{{ dim.label }}</span>
        <div class="flex items-center gap-2">
          <div class="w-12 h-1.5 rounded-full bg-[var(--color-space-800)] overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-[var(--color-blue-accent)] to-[var(--color-cyan-bright)] shadow-[0_0_6px_rgba(0,212,255,0.6)]"
              :style="{ width: `${dim.value * 100}%` }"
            ></div>
          </div>
          <span class="text-[11px] font-mono text-[var(--color-text-bright)] w-7 text-right">
            {{ (dim.value * 100).toFixed(0) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
