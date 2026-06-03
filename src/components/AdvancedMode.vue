<template>
  <div class="advanced-container">
    <a-row :gutter="24">
      <a-col :span="8">
        <a-card class="config-card">
          <template #title>
            <span class="card-title">文字配置</span>
          </template>
          <a-form layout="vertical">
            <a-form-item label="显示文字">
              <a-input
                v-model:value="localConfig.text"
                placeholder="输入要显示的文字"
                class="custom-input"
              />
            </a-form-item>

            <a-form-item label="快速填充">
              <a-space wrap>
                <a-tag
                  v-for="tag in quickTags"
                  :key="tag"
                  class="quick-tag"
                  @click="fillTag(tag)"
                >
                  {{ tag }}
                </a-tag>
              </a-space>
            </a-form-item>

            <a-form-item label="文字颜色">
              <div class="color-picker-wrapper">
                <a-input type="color" v-model:value="localConfig.textColor" class="color-input" />
                <span class="color-value">{{ localConfig.textColor }}</span>
              </div>
            </a-form-item>

            <a-form-item label="字体">
              <a-space wrap>
                <a-tag
                  v-for="font in fontList"
                  :key="font.value"
                  :class="['font-tag', { active: localConfig.fontFamily === font.value }]"
                  @click="localConfig.fontFamily = font.value"
                >
                  {{ font.label }}
                </a-tag>
              </a-space>
            </a-form-item>

            <a-form-item label="字体大小">
              <div class="slider-wrapper">
                <a-slider
                  v-model:value="localConfig.fontSize"
                  :min="16"
                  :max="200"
                />
                <span class="size-value">{{ localConfig.fontSize }}px</span>
              </div>
            </a-form-item>

            <a-form-item>
              <a-checkbox v-model:checked="localConfig.blurEffect" class="custom-checkbox">
                毛玻璃效果
              </a-checkbox>
            </a-form-item>

            <a-form-item v-if="localConfig.blurEffect" label="模糊程度">
              <div class="slider-wrapper">
                <a-slider
                  v-model:value="localConfig.blurAmount"
                  :min="5"
                  :max="50"
                />
                <span class="size-value">{{ localConfig.blurAmount }}px</span>
              </div>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <a-col :span="16">
        <a-card class="preview-card">
          <template #title>
            <span class="card-title">预览效果</span>
          </template>
          <div class="preview-container">
            <div class="preview-16-9" v-if="images.length > 0">
              <img
                :src="images[currentPreviewIndex].url"
                alt="preview"
                class="preview-img"
                :style="localConfig.blurEffect ? { filter: `blur(${localConfig.blurAmount}px)`, transform: 'scale(1.05)' } : {}"
              />
              <div class="preview-overlay">
                <div
                  v-if="localConfig.text"
                  class="preview-text"
                  :style="{
                    color: localConfig.textColor,
                    fontSize: `${localConfig.fontSize / 2}px`,
                    fontFamily: localConfig.fontFamily
                  }"
                >
                  {{ localConfig.text }}
                </div>
              </div>
            </div>
            <div v-else class="preview-empty">
              <div class="empty-icon">
                <PictureOutlined />
              </div>
              <p>请先在"全部图片"标签页上传图片</p>
            </div>
          </div>

          <div class="preview-controls" v-if="images.length > 0">
            <a-button class="control-btn" @click="prevPreview">
              <LeftOutlined />
            </a-button>
            <span class="preview-counter">{{ currentPreviewIndex + 1 }} / {{ images.length }}</span>
            <a-button class="control-btn" @click="nextPreview">
              <RightOutlined />
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { PictureOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update-config'])

const localConfig = ref({
  text: props.config.text || 'essential;',
  textColor: props.config.textColor || '#ffffff',
  fontFamily: props.config.fontFamily || 'Palatino Linotype',
  fontSize: props.config.fontSize || 150,
  blurEffect: props.config.blurEffect || false,
  blurAmount: props.config.blurAmount || 20
})

const currentPreviewIndex = ref(0)

const quickTags = ['essential;', 'playlist.', 'GAME OVER']

const fontList = [
  { label: 'Palatino Linotype', value: 'Palatino Linotype' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Didot', value: 'Didot' },
  { label: 'American Typewriter', value: 'American Typewriter' },
  { label: 'Impact', value: 'Impact' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Garamond', value: 'Garamond' }
]

const fillTag = (tag) => {
  localConfig.value.text = tag
}

watch(localConfig, (val) => {
  emit('update-config', val)
}, { deep: true })

watch(() => props.config, (val) => {
  if (val) {
    localConfig.value = { ...val }
  }
}, { deep: true })

watch(currentPreviewIndex, () => {})

const prevPreview = () => {
  if (currentPreviewIndex.value > 0) {
    currentPreviewIndex.value--
  }
}

const nextPreview = () => {
  if (currentPreviewIndex.value < props.images.length - 1) {
    currentPreviewIndex.value++
  }
}
</script>

<style scoped>
.advanced-container {
  padding: 16px 0;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}

:deep(.ant-card-head-title) {
  color: var(--text-primary);
}

.config-card {
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border) !important;
  border-radius: 12px !important;
}

:deep(.ant-card-head) {
  border-bottom-color: var(--border);
}

:deep(.ant-form-item-label > label) {
  color: var(--text-primary) !important;
  font-weight: 500;
}

:deep(.ant-form-item) {
  margin-bottom: 20px;
}

.preview-card {
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border) !important;
  border-radius: 12px !important;
}

.custom-input {
  background: var(--bg-primary) !important;
  border-color: var(--border) !important;
  border-radius: 8px;
  height: 40px;
}

:deep(.ant-input) {
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input:focus) {
  border-color: var(--accent) !important;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-input {
  width: 50px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}

.color-value {
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 14px;
  color: var(--text-secondary);
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

:deep(.ant-slider) {
  flex: 1;
  margin: 0 8px;
}

:deep(.ant-slider-track) {
  background: var(--accent) !important;
}

:deep(.ant-slider-handle::after) {
  background: var(--accent) !important;
  box-shadow: 0 0 8px var(--accent-glow) !important;
}

:deep(.ant-slider-rail) {
  background: var(--border) !important;
}

.size-value {
  min-width: 50px;
  color: var(--text-secondary);
  font-size: 14px;
  font-family: 'SF Mono', Consolas, monospace;
}

.quick-tag {
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 6px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.quick-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.font-tag {
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 6px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.font-tag:hover {
  border-color: var(--accent);
}

.font-tag.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(99, 102, 241, 0.1);
}

.custom-checkbox {
  color: var(--text-primary);
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background: var(--accent) !important;
  border-color: var(--accent) !important;
}

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-16-9 {
  position: relative;
  width: 100%;
  max-width: 640px;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-16-9 img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.preview-text {
  margin-bottom: 10px;
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary);
  padding: 60px 20px;
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 16px;
}

.preview-empty p {
  font-size: 14px;
}

.preview-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.control-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.preview-counter {
  color: var(--text-secondary);
  font-size: 14px;
  font-family: 'SF Mono', Consolas, monospace;
}
</style>
