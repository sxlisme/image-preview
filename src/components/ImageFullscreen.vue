<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fullscreen-overlay"
      ref="overlayRef"
      @click="handleClose"
      @keydown="handleKeyDown"
      tabindex="0"
    >
      <div
        class="fullscreen-bg"
        :style="{ backgroundImage: `url(${currentImage?.url})` }"
      ></div>
      <div class="fullscreen-content" @click.stop>
        <div class="nav-area left" @click.stop="prevImage"></div>
        <div class="nav-area right" @click.stop="nextImage"></div>

        <div v-if="currentImage && config.text" class="overlay-content">
          <div
            class="overlay-text"
            :style="{
              color: config.textColor,
              fontSize: `${scaledFontSize}px`,
              fontFamily: config.fontFamily
            }"
          >
            {{ config.text }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'

const props = defineProps({
  visible: Boolean,
  images: {
    type: Array,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  config: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

const overlayRef = ref(null)
const windowWidth = ref(window.innerWidth)
const currentIndex = ref(0)

const currentImage = computed(() => {
  return props.images[currentIndex.value] || null
})

const scaledFontSize = computed(() => {
  const baseWidth = 1280
  const scale = windowWidth.value / baseWidth
  return Math.round(props.config.fontSize * scale)
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

watch(() => props.visible, async (val) => {
  if (val) {
    currentIndex.value = props.initialIndex
    document.body.style.overflow = 'hidden'

    nextTick(() => {
      overlayRef.value?.focus()
      enterFullscreen()
    })
  } else {
    document.body.style.overflow = ''
    exitFullscreen()
  }
})

const enterFullscreen = async () => {
  const elem = overlayRef.value
  if (elem?.requestFullscreen) {
    await elem.requestFullscreen()
  } else if (elem?.webkitRequestFullscreen) {
    await elem.webkitRequestFullscreen()
  }
}

const exitFullscreen = async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
  }
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'ArrowLeft') {
    prevImage()
  } else if (e.key === 'ArrowRight') {
    nextImage()
  } else if (e.key === 'Escape') {
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.fullscreen-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.fullscreen-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.nav-area {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30%;
  cursor: pointer;
}

.nav-area.left {
  left: 0;
}

.nav-area.right {
  right: 0;
}

.overlay-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.overlay-text {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
}
</style>
