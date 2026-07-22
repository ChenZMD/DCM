import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  scoreCards,
  regions,
  mapMarkers,
  logicFlows,
  newsItems,
  commodities,
  targetPool,
} from '@/data/mockData'
import type {
  ScoreCardData,
  RegionInfo,
  MapMarker,
  DashboardState,
} from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  // ===== 状态 =====
  const selectedRegion = ref<RegionInfo | null>(regions[1]) // 默认华南
  const selectedCard = ref<ScoreCardData | null>(scoreCards[0])
  const selectedMarker = ref<MapMarker | null>(null)
  const isLive = ref(true)
  const viewerCount = ref(1280)
  const currentTime = ref('')
  const mapModalOpen = ref(false)

  // 原始数据引用（实际接入 API 时替换为请求结果）
  const scoreCardList = ref<ScoreCardData[]>(scoreCards)
  const regionList = ref<RegionInfo[]>(regions)
  const markerList = ref<MapMarker[]>(mapMarkers)
  const logicFlowList = ref(logicFlows)
  const newsList = ref(newsItems)
  const commodityList = ref<typeof commodities>(commodities)
  const targetList = ref(targetPool)

  // ===== 计算属性 =====
  const overallAvgScore = computed(() => {
    if (!scoreCardList.value.length) return 0
    return (
      scoreCardList.value.reduce((s, c) => s + c.overallScore, 0) /
      scoreCardList.value.length
    )
  })

  const radarDimensions = computed(() => {
    return selectedCard.value?.dimensions ?? []
  })

  // ===== 动作 =====
  function selectCard(card: ScoreCardData) {
    selectedCard.value = card
  }

  function selectRegion(region: RegionInfo) {
    selectedRegion.value = region
  }

  function selectMarker(marker: MapMarker) {
    selectedMarker.value = marker
    mapModalOpen.value = true
  }

  function closeMapModal() {
    mapModalOpen.value = false
    selectedMarker.value = null
  }

  function updateTime() {
    const now = new Date()
    currentTime.value = now.toLocaleString('zh-CN', { hour12: false })
  }

  // 模拟实时更新（接入 WebSocket 后替换）
  function simulateRealtime() {
    viewerCount.value += Math.floor(Math.random() * 5) - 2
    if (viewerCount.value < 0) viewerCount.value = 0
  }

  return {
    // state
    selectedRegion,
    selectedCard,
    selectedMarker,
    isLive,
    viewerCount,
    currentTime,
    mapModalOpen,
    scoreCardList,
    regionList,
    markerList,
    logicFlowList,
    newsList,
    commodityList,
    targetList,
    // getters
    overallAvgScore,
    radarDimensions,
    // actions
    selectCard,
    selectRegion,
    selectMarker,
    closeMapModal,
    updateTime,
    simulateRealtime,
  }
})
