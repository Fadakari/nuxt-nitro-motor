<script setup>
// این کامپوننت را در فرم‌های ادمین استفاده کن
const props = defineProps({
  modelValue: String, // آدرس عکس فعلی
  label: { type: String, default: 'تصویر شاخص' }
});

const emit = defineEmits(['update:modelValue']);
const showManager = ref(false);

const handleSelect = (url) => {
  emit('update:modelValue', url);
  // مودال خودکار بسته می‌شود چون در ImageManager روی close صدا زده می‌شود
};
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>

    <div 
      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center gap-4 bg-black/50 dark:bg-white/5 hover:bg-gray-900 transition-colors cursor-pointer group"
      @click="showManager = true"
    >
      <div v-if="modelValue" class="relative w-full aspect-video rounded-lg overflow-hidden bg-dark/50">
        <img :src="modelValue" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="text-white font-bold text-sm flex items-center gap-1">
            <span class="i-heroicons-pencil"></span>
            تغییر تصویر
          </span>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
          <span class="i-heroicons-photo text-2xl"></span>
        </div>
        <span class="text-sm text-gray-500">برای انتخاب تصویر کلیک کنید</span>
      </div>
    </div>

    <ImageManager 
      v-if="showManager" 
      :modelValue="modelValue"
      @update:modelValue="handleSelect"
      @close="showManager = false"
    />
  </div>
</template>