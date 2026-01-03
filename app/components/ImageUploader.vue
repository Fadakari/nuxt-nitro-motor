<script setup>
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
const showModal = ref(false);
</script>

<template>
  <div>
    <div 
      @click="showModal = true"
      class="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:border-primary transition-colors group"
    >
      <img v-if="modelValue" :src="modelValue" class="w-full h-full object-cover" />
      <div class="absolute inset-0 flex flex-col items-center justify-center" :class="modelValue ? 'bg-black/50 opacity-0 group-hover:opacity-100' : 'opacity-50'">
        <span class="i-ph-image text-3xl mb-1 text-white/80"></span>
        <span class="text-xs text-white font-bold">{{ modelValue ? 'تغییر عکس' : 'انتخاب عکس' }}</span>
      </div>
    </div>

    <ImageManager 
      v-if="showModal" 
      :modelValue="modelValue"
      @update:modelValue="val => emit('update:modelValue', val)" 
      @close="showModal = false" 
    />
  </div>
</template>