<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import BaseIcon from './BaseIcon.vue'

const store = useDashboardStore()

// 合并资讯 + 大宗商品 + 标的，形成滚动数据流
const tickerItems = computed(() => {
  const news = store.newsList.map((n) => ({
    id: n.id,
    type: 'news' as const,
    text: `${n.title}`,
    tag: n.tags[0] || n.category,
    color: n.importance === 'high' ? '#00d4ff' : '#7da0c4',
  }))
  const cmd = store.commodityList.map((c) => ({
    id: c.id,
    type: 'cmd' as const,
    text: `${c.name} ${c.price.toLocaleString()} ${c.unit}`,
    change: c.change,
    tag: c.symbol,
  }))
  const targets = store.targetList.map((t) => ({
    id: t.id,
    type: 'target' as const,
    text: `${t.name}(${t.code}) ${t.price}`,
    change: t.change,
    tag: t.sector,
  }))
  return [...news, ...cmd, ...targets]
})

// 复制一份用于无缝滚动
const loopItems = computed(() => [...tickerItems.value, ...tickerItems.value])
</script>

<template>
  <div class="panel glow-border flex items-center h-11 px-0 overflow-hidden relative">
    <!-- 左侧标签 -->
    <div class="flex items-center gap-2 px-4 h-full bg-[rgba(16,40,68,0.55)] border-r border-[var(--color-slate-line)]/70 shrink-0 z-10">
      <BaseIcon name="news" :size="15" class="text-[var(--color-cyan-glow)]" />
      <span class="text-[11px] font-semibold text-[var(--color-text-bright)] whitespace-nowrap tracking-wide">实时数据流</span>
    </div>

    <!-- 滚动区域 -->
    <div class="flex-1 overflow-hidden relative">
      <div class="ticker-track py-2.5">
        <div
          v-for="item in loopItems"
          :key="item.id"
          class="flex items-center gap-2.5 px-5 border-r border-[var(--color-slate-line)]/30 shrink-0"
        >
          <span class="chip">{{ item.tag }}</span>
          <span class="text-[12px] text-[var(--color-text-bright)] whitespace-nowrap">{{ item.text }}</span>
          <span
            v-if="'change' in item && item.change !== undefined"
            class="text-[11px] font-mono tabular-nums font-medium"
            :class="item.change >= 0 ? 'text-[var(--color-up)]' : 'text-[var(--color-down)]'"
          >{{ item.change >= 0 ? '+' : '' }}{{ item.change }}%</span>
          <BaseIcon
            v-if="item.type === 'news'"
            name="trend" :size="12"
            :style="{ color: item.color }"
          />
        </div>
      </div>
      <!-- 左右渐隐遮罩 -->
      <div class="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--color-space-950)] to-transparent pointer-events-none"></div>
      <div class="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--color-space-950)] to-transparent pointer-events-none"></div>
    </div>
  </div>
</template>
