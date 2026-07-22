<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import BaseIcon from './BaseIcon.vue'

const store = useDashboardStore()

function scoreColor(score: number): string {
  if (score >= 0.65) return '#22d3a8'
  if (score >= 0.5) return '#fbbf24'
  return '#ff5c7c'
}
</script>

<template>
  <div class="panel flex flex-col h-full">
    <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--color-slate-line)]/60">
      <div class="panel-title">
        <BaseIcon name="chart" :size="16" class="text-[var(--color-cyan-glow)]" />
        相关标的池
      </div>
      <span class="text-[11px] text-[var(--color-text-mute)]">{{ store.targetList.length }} 只</span>
    </div>

    <div class="flex-1 overflow-y-auto px-2 py-2 space-y-1">
      <div
        v-for="t in store.targetList"
        :key="t.id"
        class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl border border-transparent hover:bg-[rgba(16,40,68,0.5)] hover:border-[rgba(0,212,255,0.18)] transition-all duration-200 cursor-pointer"
      >
        <!-- 评分环 -->
        <div class="relative w-10 h-10 shrink-0">
          <svg viewBox="0 0 36 36" class="w-10 h-10 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(31,58,82,0.5)" stroke-width="3" />
            <circle
              cx="18" cy="18" r="15" fill="none" :stroke="scoreColor(t.score)" stroke-width="3"
              stroke-linecap="round"
              :stroke-dasharray="`${t.score * 94.2} 94.2`"
              :style="{ filter: `drop-shadow(0 0 4px ${scoreColor(t.score)})` }"
            />
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold" :style="{ color: scoreColor(t.score) }">
            {{ (t.score * 100).toFixed(0) }}
          </span>
        </div>

        <!-- 名称 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-[12px] font-medium text-[var(--color-text-bright)] truncate">{{ t.name }}</span>
            <span class="text-[9px] text-[var(--color-text-mute)]">{{ t.code }}</span>
          </div>
          <span class="text-[9px] text-[var(--color-text-mute)]">{{ t.sector }}</span>
        </div>

        <!-- 价格 -->
        <div class="text-right shrink-0">
          <div class="text-[12px] font-mono text-[var(--color-text-bright)] tabular-nums">{{ t.price.toLocaleString() }}</div>
          <div class="text-[10px] font-mono tabular-nums font-medium" :class="t.change >= 0 ? 'text-[var(--color-up)]' : 'text-[var(--color-down)]'">
            {{ t.change >= 0 ? '+' : '' }}{{ t.change }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
