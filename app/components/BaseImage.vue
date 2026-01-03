<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  aspectRatio: { type: String, default: 'aspect-square' }
});

const isLoaded = ref(false);
const hasError = ref(false);

watch(() => props.src, () => {
  isLoaded.value = false;
  hasError.value = false;
});
</script>

<template>
  <div class="relative overflow-hidden w-full bg-gray-100 dark:bg-gray-800" :class="aspectRatio">
    
    <div 
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 z-10"
    >
      <div class="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>

    <NuxtImg
      :src="src"
      :alt="alt"
      loading="lazy"
      class="w-full h-full object-cover transition-all duration-700 ease-out"
      :class="[isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105']"
      @load="isLoaded = true"
      @error="hasError = true"
    />

    <div v-if="hasError" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
      <span class="i-ph-image-broken text-3xl mb-1"></span>
      <span class="text-[10px]">خطا در تصویر</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
</style>