<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import BaseIcon from './BaseIcon.vue'

const store = useDashboardStore()
const flow = store.logicFlowList[0]

function stageColor(status: string): string {
  switch (status) {
    case 'completed': return '#22d3a8'
    case 'current': return '#00d4ff'
    default: return '#4a6685'
  }
}
</script>

<template>
  <div class="panel flex flex-col h-full">
    <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--color-slate-line)]/60">
      <div class="panel-title">
        <BaseIcon name="flow" :size="16" class="text-[var(--color-cyan-glow)]" />
        核心逻辑推演
      </div>
      <span class="text-[11px] text-[var(--color-text-mute)]">{{ flow.targetName }}</span>
    </div>

    <div class="flex-1 overflow-y-auto px-4 py-3 space-y-1">
      <div
        v-for="(stage, idx) in flow.stages"
        :key="stage.id"
        class="relative fade-up group"
      >
        <!-- 连接线（渐变） -->
        <div
          v-if="idx < flow.stages.length - 1"
          class="absolute left-[15px] top-9 bottom-[-8px] w-px bg-gradient-to-b from-[var(--color-slate-line)] to-transparent"
        ></div>

        <div class="flex gap-3 py-1.5 rounded-lg group-hover:bg-[rgba(16,40,68,0.35)] transition-colors px-1 -mx-1">
          <!-- 阶段节点 -->
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all"
            :style="{
              borderColor: stageColor(stage.status),
              background: stage.status === 'completed' ? 'rgba(34,211,168,0.15)' : stage.status === 'current' ? 'rgba(0,212,255,0.15)' : 'transparent',
              boxShadow: stage.status === 'current' ? '0 0 14px rgba(0,212,255,0.4)' : 'none'
            }"
          >
            <BaseIcon
              v-if="stage.status === 'completed'"
              name="shield" :size="14"
              :style="{ color: stageColor(stage.status) }"
            />
            <span
              v-else
              class="text-[12px] font-bold"
              :style="{ color: stageColor(stage.status) }"
            >{{ stage.id }}</span>
          </div>

          <!-- 阶段内容 -->
          <div class="flex-1 pb-1">
            <div class="flex items-center justify-between">
              <span class="text-[13px] font-semibold"
                :style="{ color: stage.status === 'pending' ? 'var(--color-text-mute)' : 'var(--color-text-bright)' }">
                阶段{{ stage.id }} · {{ stage.title }}
              </span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded"
                :style="{ color: stageColor(stage.status), background: stage.status === 'pending' ? 'transparent' : stageColor(stage.status) + '1a' }">
                {{ (stage.confidence * 100).toFixed(0) }}%
              </span>
            </div>
            <p class="text-[11px] text-[var(--color-text-dim)] mt-1 leading-relaxed">{{ stage.content }}</p>
            <div class="flex flex-wrap gap-1 mt-1.5">
              <span
                v-for="kp in stage.keyPoints"
                :key="kp"
                class="chip"
              >{{ kp }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 结论 -->
      <div class="mt-3 p-3 rounded-xl bg-gradient-to-r from-[rgba(30,64,175,0.25)] to-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.25)]">
        <div class="flex items-center gap-1.5 mb-1.5">
          <BaseIcon name="star" :size="13" class="text-[var(--color-warn)]" />
          <span class="text-[11px] font-semibold text-[var(--color-text-bright)]">推演结论</span>
        </div>
        <p class="text-[11px] text-[var(--color-text-dim)] leading-relaxed">{{ flow.conclusion }}</p>
      </div>
    </div>
  </div>
</template>
