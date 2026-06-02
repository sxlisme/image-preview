<template>
  <div class="app-container" :data-theme="theme">
    <header class="app-header">
      <h1 class="app-title">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        Image Preview
      </h1>
      <button class="theme-toggle" @click="toggleTheme">
        <svg v-if="theme === 'dark'" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg v-else class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </header>

    <a-tabs v-model:activeKey="activeTab" class="main-tabs">
      <a-tab-pane key="gallery" tab="全部图片">
        <ImageGallery
          :images="images"
          :advancedConfig="advancedConfig"
          @open-fullscreen="handleOpenFullscreen"
        />
      </a-tab-pane>
      <a-tab-pane key="advanced" tab="高级">
        <AdvancedMode
          :images="images"
          @update-config="handleUpdateAdvancedConfig"
        />
      </a-tab-pane>
    </a-tabs>

    <ImageFullscreen
      :visible="fullscreenVisible"
      :images="images"
      :initialIndex="fullscreenIndex"
      :config="advancedConfig"
      @close="handleCloseFullscreen"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageGallery from './components/ImageGallery.vue'
import ImageFullscreen from './components/ImageFullscreen.vue'
import AdvancedMode from './components/AdvancedMode.vue'

const theme = ref('dark')
const activeTab = ref('gallery')
const images = ref([])
const fullscreenVisible = ref(false)
const fullscreenIndex = ref(0)
const advancedConfig = ref({
  text: 'essential;',
  textColor: '#ffffff',
  fontFamily: 'Palatino Linotype',
  fontSize: 150,
  showSpectrum: false
})

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

const handleOpenFullscreen = (index) => {
  fullscreenIndex.value = index
  fullscreenVisible.value = true
}

const handleCloseFullscreen = () => {
  fullscreenVisible.value = false
}

const handleUpdateAdvancedConfig = (config) => {
  advancedConfig.value = { ...advancedConfig.value, ...config }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 24px 48px;
  transition: background 0.3s ease;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.app-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  color: var(--accent);
}

.theme-toggle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent);
  box-shadow: 0 0 20px var(--accent-glow);
}

.theme-icon {
  width: 20px;
  height: 20px;
}

.main-tabs {
  background: var(--bg-card);
  padding: 24px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

:deep(.ant-tabs) {
  background: transparent;
}

:deep(.ant-tabs-nav::before) {
  border-bottom-color: var(--border);
}

:deep(.ant-tabs-tab) {
  color: var(--text-secondary);
  font-size: 15px;
  padding: 12px 0;
  margin: 0 24px 0 0;
}

:deep(.ant-tabs-tab:hover) {
  color: var(--text-primary);
}

:deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: var(--accent);
}

:deep(.ant-tabs-ink-bar) {
  background: var(--accent);
}

:deep(.ant-tabs-content) {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .app-container {
    padding: 16px;
  }

  .app-title {
    font-size: 22px;
  }
}
</style>
