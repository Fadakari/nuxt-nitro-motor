<template>
  <div class="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl transition-all duration-300">
    
    <div v-if="type === 'upload'" class="w-64 text-center">
      <div class="relative w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center border border-primary/50">
        <span class="i-heroicons-cloud-arrow-up text-4xl text-primary animate-pulse"></span>
        <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path class="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="2" />
          <path class="text-primary transition-all duration-300 ease-linear" :stroke-dasharray="progress + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
      <p class="text-white font-bold mb-1">در حال آپلود تصویر...</p>
      <p class="text-gold text-sm font-mono">{{ progress }}%</p>
    </div>

    <div v-else class="text-center">
      <div class="flex gap-2 justify-center mb-4">
        <span class="w-3 h-3 bg-gold rounded-full animate-bounce" style="animation-delay: 0s"></span>
        <span class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
        <span class="w-3 h-3 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
      </div>
      <p class="text-white font-bold">{{ message || 'در حال پردازش...' }}</p>
    </div>

  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'loading' }, // 'loading' or 'upload'
  progress: { type: Number, default: 0 },
  message: { type: String, default: '' }
})
</script>