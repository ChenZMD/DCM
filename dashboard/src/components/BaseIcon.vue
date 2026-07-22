<script setup lang="ts">
/**
 * 项目锁定图标库 —— 统一描边 SVG 图标
 * P0 规则：禁止 emoji 作为功能图标，所有图标使用此组件
 * 默认尺寸：16px(行内) / 20px(按钮内) / 24px(独立图标)，支持任意数值
 */
defineProps<{
  name: string
  size?: number
  class?: string
}>()

const icons: Record<string, string> = {
  // 导航/通用
  globe:
    'M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 2.5 4 5.8 4 10s-1.5 7.5-4 10m0-20C9.5 4.5 8 7.8 8 12s1.5 7.5 4 10M2 12h20',
  radar:
    'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 4a2 2 0 100 4 2 2 0 000-4z',
  chart:
    'M3 3v18h18M7 14l3-3 3 3 5-6',
  map:
    'M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2zm0 0v16m6-14v16',
  flow:
    'M4 6h6m0 0l-2-2m2 2l-2 2M14 18h6m0 0l-2-2m2 2l-2 2',
  news:
    'M4 4h12v16H4zM16 8h4v12h-4zM7 8h6M7 12h6M7 16h4',
  message:
    'M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12z',
  live:
    'M8 5v14l11-7zM22 8a6 6 0 00-6-6',
  bell:
    'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  trophy:
    'M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4zM7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3',
  star:
    'M12 2l3 6.5 7 .7-5.2 4.8 1.5 7L12 17.5 5.7 21l1.5-7L2 9.2l7-.7z',
  shield:
    'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z',
  bolt:
    'M13 2L4 14h7l-1 8 9-12h-7z',
  refresh:
    'M21 12a9 9 0 11-3-6.7M21 4v5h-5',
  trend:
    'M3 17l6-6 4 4 7-8',
  alert:
    'M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
  link:
    'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1',
}
</script>

<template>
  <svg
    :class="['icon', $props.class]"
    :width="size ?? 16"
    :height="size ?? 16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="icons[name] || icons.globe" />
  </svg>
</template>
