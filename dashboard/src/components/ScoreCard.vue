<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { useDashboardStore } from '@/stores/dashboard'
import { buildMiniLineOption, CHART_COLORS } from '@/utils/chartOptions'
import type { ScoreCardData } from '@/types'
import BaseIcon from './BaseIcon.vue'

const store = useDashboardStore()
const props = defineProps<{ card: ScoreCardData }>()

const miniRef = ref<HTMLDivElement>()
let mini: echarts.ECharts | null = null

const isActive = () => store.selectedCard?.id === props.card.id

function lineColor(): string {
  const t = props.card.trendChart
  if (!t || t.length < 2) return CHART_COLORS.blue
  return t[t.length - 1] >= t[0] ? CHART_COLORS.up : CHART_COLORS.down
}

function riskColor(): string {
  switch (props.card.riskLevel) {
    case 'high': return CHART_COLORS.down
    case 'medium': return CHART_COLORS.warn
    default: return CHART_COLORS.up
  }
}

function riskLabel(): string {
  switch (props.card.riskLevel) {
    case 'high': return '高风险'
    case 'medium': return '中风险'
    default: return '低风险'
  }
}

onMounted(() => {
  if (miniRef.value) {
    mini = echarts.init(miniRef.value)
    mini.setOption(buildMiniLineOption(props.card.trendChart || [], lineColor()))
  }
})

onBeforeUnmount(() => mini?.dispose())
</script>

<template>
  <div
    class="panel fade-up cursor-pointer transition-all duration-200 p-3.5 hover-lift"
    :class="isActive()
      ? 'glow-border ring-1 ring-[var(--color-cyan-glow)]/40'
      : ''"
    @click="store.selectCard(card)"
  >
    <!-- 头部 -->
    <div class="flex items-start justify-between mb-2">
      <div class="min-w-0">
        <div class="text-[13px] font-semibold text-[var(--color-text-bright)] truncate">{{ card.name }}</div>
        <div class="text-[10px] text-[var(--color-text-mute)] mt-0.5">{{ card.category }}</div>
      </div>
      <div class="flex flex-col items-end shrink-0 ml-2">
        <div class="text-[22px] font-bold font-mono leading-none"
          :style="{ color: lineColor() }">
          {{ (card.overallScore * 100).toFixed(0) }}
        </div>
        <div class="text-[9px] text-[var(--color-text-mute)] mt-1">综合评分</div>
      </div>
    </div>

    <!-- 迷你趋势图 -->
    <div ref="miniRef" class="h-9 -mx-1"></div>

    <!-- 标签 -->
    <div class="flex flex-wrap gap-1 mt-2 mb-2.5">
      <span v-for="tag in card.tags" :key="tag" class="chip">{{ tag }}</span>
    </div>

    <!-- 底部信息 -->
    <div class="flex items-center justify-between pt-2.5 border-t border-[var(--color-slate-line)]/50">
      <div class="flex items-center gap-1.5">
        <BaseIcon name="alert" :size="13" :style="{ color: riskColor() }" />
        <span class="text-[10px] font-medium" :style="{ color: riskColor() }">{{ riskLabel() }}</span>
      </div>
      <span class="text-[9px] text-[var(--color-text-mute)] font-mono">{{ card.updateAt.slice(11) }}</span>
    </div>
  </div>
</template>
