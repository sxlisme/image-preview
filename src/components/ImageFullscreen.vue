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
      <div class="fullscreen-content" @click.stop>
        <div class="image-container">
          <img
            v-if="currentImage"
            :src="currentImage.url"
            :alt="currentImage.name"
            class="fullscreen-image"
            :class="{ blur: config.blurEffect }"
          />
          <div class="nav-area left" @click.stop="prevImage"></div>
          <div class="nav-area right" @click.stop="nextImage"></div>
        </div>

        <div v-if="currentImage && (config.text || config.showSpectrum)" class="overlay-content">
          <div
            v-if="config.text"
            class="overlay-text"
            :style="{
              color: config.textColor,
              fontSize: `${scaledFontSize}px`,
              fontFamily: config.fontFamily
            }"
          >
            {{ config.text }}
          </div>
          <div v-if="config.showSpectrum" class="overlay-spectrum">
            <canvas ref="spectrumCanvas" :width="scaledCanvasWidth" height="60"></canvas>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted, nextTick } from 'vue'

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
const spectrumCanvas = ref(null)
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

const scaledCanvasWidth = computed(() => {
  const baseWidth = 1280
  const scale = windowWidth.value / baseWidth
  return Math.round(300 * scale)
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopSpectrumAnimation()
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

      if (props.config.showSpectrum) {
        startSpectrumAnimation()
      }
    })
  } else {
    document.body.style.overflow = ''
    exitFullscreen()
    stopSpectrumAnimation()
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

let animationId = null

const startSpectrumAnimation = () => {
  if (!spectrumCanvas.value) return

  const canvas = spectrumCanvas.value
  const ctx = canvas.getContext('2d')
  const barCount = 32
  const barWidth = canvas.width / barCount - 2

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < barCount; i++) {
      const height = Math.random() * canvas.height * 0.8 + canvas.height * 0.1
      const hue = (i / barCount) * 60 + 120
      ctx.fillStyle = `hsl(${hue}, 80%, 60%)`
      ctx.fillRect(
        i * (barWidth + 2) + 1,
        canvas.height - height,
        barWidth,
        height
      )
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()
}

const stopSpectrumAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

watch(() => props.config.showSpectrum, (val) => {
  if (props.visible) {
    if (val) {
      nextTick(startSpectrumAnimation)
    } else {
      stopSpectrumAnimation()
    }
  }
})

watch(currentIndex, () => {
  nextTick(() => {
    if (props.config.showSpectrum) {
      stopSpectrumAnimation()
      startSpectrumAnimation()
    }
  })
})
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

.fullscreen-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.fullscreen-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fullscreen-image.blur {
  filter: blur(12px);
  transform: scale(1.05);
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
  margin-bottom: 20px;
}

.overlay-spectrum {
  margin-top: 20px;
}

.overlay-spectrum canvas {
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
}
</style>
