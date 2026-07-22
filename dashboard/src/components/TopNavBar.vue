<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import BaseIcon from './BaseIcon.vue'

const store = useDashboardStore()

const navItems = [
  { id: 'overview', label: '宏观总览', active: true },
  { id: 'map', label: '地缘地图', active: false },
  { id: 'radar', label: '量化评分', active: false },
  { id: 'logic', label: '推演逻辑', active: false },
  { id: 'flow', label: '实时数据流', active: false },
]
</script>

<template>
  <header class="h-16 flex items-center justify-between px-6 border-b border-[rgba(0,212,255,0.12)] bg-gradient-to-r from-[var(--color-space-900)] via-[var(--color-space-850)] to-[var(--color-space-900)] relative">
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.4)] to-transparent"></div>
    <!-- Logo + 标题 -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--color-cyan-glow)] to-[var(--color-blue-accent)] shadow-[0_0_20px_rgba(0,212,255,0.45)] border border-[rgba(255,255,255,0.15)]">
        <BaseIcon name="globe" :size="22" class="text-[var(--color-space-950)]" />
      </div>
      <div>
        <h1 class="text-[16px] font-bold text-[var(--color-text-bright)] tracking-wide leading-tight">
          宏观多维度量化看板
        </h1>
        <p class="text-[9px] text-[var(--color-text-mute)] tracking-[0.2em]">MACRO QUANTUM DASHBOARD</p>
      </div>
    </div>

    <!-- 导航 -->
    <nav class="hidden lg:flex items-center gap-1">
      <button
        v-for="item in navItems"
        :key="item.id"
        class="px-3.5 py-1.5 text-[13px] rounded-lg transition-all duration-200"
        :class="item.active
          ? 'text-[var(--color-space-950)] font-semibold bg-gradient-to-r from-[var(--color-cyan-glow)] to-[var(--color-cyan-soft)] shadow-[0_0_14px_rgba(0,212,255,0.4)]'
          : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)] hover:bg-[rgba(16,40,68,0.6)]'"
      >
        {{ item.label }}
      </button>
    </nav>

    <!-- 右侧状态 -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(16,40,68,0.6)] border border-[rgba(0,212,255,0.18)]">
        <span class="live-dot"></span>
        <span class="text-[12px] text-[var(--color-up)] font-semibold tracking-wider">LIVE</span>
        <span class="w-px h-3.5 bg-[var(--color-slate-line)]"></span>
        <span class="text-[12px] text-[var(--color-text-dim)] font-mono tabular-nums">{{ store.viewerCount.toLocaleString() }}</span>
      </div>
      <div class="text-[13px] text-[var(--color-text-dim)] font-mono tabular-nums hidden sm:block">
        {{ store.currentTime }}
      </div>
      <button class="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-dim)] hover:text-[var(--color-cyan-glow)] hover:bg-[rgba(16,40,68,0.6)] border border-transparent hover:border-[rgba(0,212,255,0.2)] transition-all">
        <BaseIcon name="bell" :size="18" />
      </button>
    </div>
  </header>
</template>
