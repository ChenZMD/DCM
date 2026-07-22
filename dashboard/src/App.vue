<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import TopNavBar from '@/components/TopNavBar.vue'
import MacroMap from '@/components/MacroMap.vue'
import RadarChart from '@/components/RadarChart.vue'
import ScoreCard from '@/components/ScoreCard.vue'
import LogicFlow from '@/components/LogicFlow.vue'
import NewsTicker from '@/components/NewsTicker.vue'
import TargetPool from '@/components/TargetPool.vue'

const store = useDashboardStore()
let timer: number | undefined

onMounted(() => {
  store.updateTime()
  timer = window.setInterval(() => {
    store.updateTime()
    store.simulateRealtime()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- 顶部导航 -->
    <TopNavBar />

    <!-- 主内容区 -->
    <main class="flex-1 min-h-0 grid grid-cols-12 gap-3 p-3">
      <!-- 左侧：宏观地图 -->
      <section class="col-span-12 lg:col-span-5 xl:col-span-4 min-h-0">
        <MacroMap />
      </section>

      <!-- 中间：评分卡 + 推演 -->
      <section class="col-span-12 lg:col-span-4 min-h-0 flex flex-col gap-3">
        <!-- 评分卡网格 -->
        <div class="grid grid-cols-2 gap-3 overflow-y-auto flex-1 min-h-0">
          <ScoreCard
            v-for="card in store.scoreCardList"
            :key="card.id"
            :card="card"
          />
        </div>
        <!-- 推演逻辑 -->
        <div class="h-[42%] min-h-[190px]">
          <LogicFlow />
        </div>
      </section>

      <!-- 右侧：雷达图 + 标的池 -->
      <section class="col-span-12 lg:col-span-3 xl:col-span-4 min-h-0 flex flex-col gap-3">
        <div class="h-[58%] min-h-[280px]">
          <RadarChart />
        </div>
        <div class="flex-1 min-h-[170px]">
          <TargetPool />
        </div>
      </section>
    </main>

    <!-- 底部滚动资讯 -->
    <footer class="px-3 pb-3">
      <NewsTicker />
    </footer>
  </div>
</template>
