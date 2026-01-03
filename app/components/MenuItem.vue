<script setup>
const { siteData } = useSiteData();
defineProps({
  item: { type: Object, required: true },
  currency: { type: String, default: 'تومان' }
});
const { openModal } = useProductModal();

const getLabelStyle = (labelText) => {
  const found = siteData.value?.labels?.find(l => l.text === labelText);
  if (found) return { color: found.color, emoji: found.emoji };
  return { color: 'gray', emoji: '' };
};

const calculateDiscount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};
</script>

<template>
  <div 
    @click="(e) => openModal(item, e)"
    class="group cursor-pointer w-full bg-white dark:bg-[#1E2025] rounded-dynamic p-3 transition-all duration-300 active:scale-[0.98] hover:shadow-xl hover:shadow-primary/5 border border-transparent dark:border-white/5"
  >
    <div class="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
      <BaseImage :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      
      <div v-if="!item.isAvailable" class="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
        <span class="text-white font-bold px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-md">تمام شد</span>
      </div>

      <div v-else-if="item.discountPrice && item.discountPrice < item.price" class="absolute top-3 right-3 bg-[#FFEDD5] text-[#C2410C] dark:bg-red-500/20 dark:text-red-200 text-xs font-black px-3 py-1.5 rounded-full shadow-sm">
        {{ calculateDiscount(item.price, item.discountPrice) }}%
      </div>
    </div>

    <div class="px-1">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight pl-2">
          {{ item.title }}
        </h3>
      </div>

      <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 min-h-[40px]">
        {{ item.description }}
      </p>

      <div v-if="item.labels && item.labels.length > 0" class="flex flex-wrap gap-1.5 mb-3 mt-2">
        <span 
          v-for="tag in item.labels" 
          :key="tag"
          class="px-2 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-colors"
          :style="{
            color: getLabelStyle(tag).color,
            borderColor: getLabelStyle(tag).color + '40',
            backgroundColor: getLabelStyle(tag).color + '15'
          }"
        >
          <span v-if="getLabelStyle(tag).emoji">{{ getLabelStyle(tag).emoji }}</span>
          {{ tag }}
        </span>
      </div>

      <div class="flex items-center justify-between mt-auto">
        
        <div class="flex flex-col">
          <span v-if="item.discountPrice" class="text-xs text-slate-400 line-through decoration-red-400 decoration-2">
            {{ item.price.toLocaleString() }}
          </span>
          <div class="flex items-center gap-1 text-slate-900 dark:text-white font-black text-xl">
            {{ (item.discountPrice || item.price).toLocaleString() }}
            <span class="text-[10px] font-normal text-slate-500 opacity-80">{{ currency }}</span>
          </div>
        </div>

        <button class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
          <span class="i-ph-plus text-xl font-bold"></span>
        </button>
      </div>
    </div>
  </div>
</template>