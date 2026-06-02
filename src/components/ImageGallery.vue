<template>
  <div class="gallery-container">
    <div class="toolbar">
      <a-space>
        <a-button type="primary" class="btn-primary" @click="triggerUpload">
          <UploadOutlined /> 上传图片
        </a-button>
        <a-button class="btn-secondary" @click="triggerFolderOpen">
          <FolderOpenOutlined /> 打开文件夹
        </a-button>
      </a-space>
      <span class="image-count" v-if="images.length > 0">
        {{ images.length }} 张图片
      </span>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept="image/*"
      style="display: none"
      @change="handleFileSelect"
    />
    <input
      ref="folderInputRef"
      type="file"
      webkitdirectory
      multiple
      accept="image/*"
      style="display: none"
      @change="handleFolderSelect"
    />

    <div v-if="images.length === 0" class="empty-state">
      <div class="empty-icon">
        <PictureOutlined />
      </div>
      <p class="empty-text">请上传图片或打开文件夹</p>
    </div>

    <div v-else class="gallery-grid">
      <div
        v-for="(img, index) in images"
        :key="img.url"
        class="thumbnail-wrapper"
        @click="$emit('open-fullscreen', index)"
      >
        <img
          :src="img.url"
          :alt="img.name"
          class="thumbnail"
          loading="lazy"
        />
        <div class="thumbnail-overlay">
          <span class="thumbnail-name">{{ img.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadOutlined, FolderOpenOutlined, PictureOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  advancedConfig: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['open-fullscreen'])

const fileInputRef = ref(null)
const folderInputRef = ref(null)

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const triggerFolderOpen = () => {
  folderInputRef.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
  event.target.value = ''
}

const handleFolderSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
  event.target.value = ''
}

const processFiles = (files) => {
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      props.images.push({
        name: file.name,
        url: url,
        file: file
      })
    }
  })
}
</script>

<style scoped>
.gallery-container {
  padding: 16px 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.btn-primary {
  background: var(--accent) !important;
  border-color: var(--accent) !important;
  border-radius: 8px;
  height: 40px;
  font-weight: 500;
}

.btn-primary:hover {
  opacity: 0.9;
  box-shadow: 0 0 20px var(--accent-glow);
}

.btn-secondary {
  background: var(--bg-secondary) !important;
  border-color: var(--border) !important;
  color: var(--text-primary) !important;
  border-radius: 8px;
  height: 40px;
  font-weight: 500;
}

.btn-secondary:hover {
  border-color: var(--accent) !important;
  color: var(--accent) !important;
}

.image-count {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.empty-text {
  color: var(--text-secondary);
  font-size: 16px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.thumbnail-wrapper {
  position: relative;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: var(--bg-secondary);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.thumbnail-wrapper:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.thumbnail-wrapper:hover .thumbnail {
  transform: scale(1.05);
}

.thumbnail-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 40px 16px 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.thumbnail-wrapper:hover .thumbnail-overlay {
  opacity: 1;
}

.thumbnail-name {
  color: #fff;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
</style>
