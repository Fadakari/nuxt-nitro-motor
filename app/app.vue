<script setup>
import { computed, onMounted, ref } from 'vue';
import '../assets/styles/main.css';
import ProductModal from './components/ProductModal.vue';

const { siteData, fetchSiteData } = useSiteData();
const { initTheme } = useTheme();

const isReady = ref(false);

const hexToRgb = (hex) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
       c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(' ');
  }
  return '0 0 0';
};

// --- تعریف مپ برای تبدیل کلاس‌ها به پیکسل ---
const radiusMap = {
  'rounded-md': '0.375rem',  // 6px
  'rounded-xl': '0.75rem',   // 12px
  'rounded-3xl': '1.5rem',   // 24px
  'rounded-full': '9999px'
};

const dynamicStyles = computed(() => {
  // جلوگیری از ارور اگر دیتا هنوز لود نشده
  if (!siteData.value || !siteData.value.appearance) return {};
  
  const pColor = siteData.value.appearance.primaryColor || '#f59e0b';
  const sColor = siteData.value.appearance.secondaryColor || '#1e293b';
  const fontFamily = siteData.value.appearance.fontFamily || 'Vazirmatn';
  const radius = siteData.value.appearance.radius || 'rounded-3xl'; // مقدار پیش‌فرض

  return {
    '--primary-color': pColor,
    '--secondary-color': sColor,
    '--primary-rgb': hexToRgb(pColor),
    '--secondary-rgb': hexToRgb(sColor),
    '--font-family': fontFamily,
    // اینجا حالا radiusMap تعریف شده و کار می‌کند
    '--border-radius': radiusMap[radius] || '1.5rem', 
  };
});

onMounted(async () => {
  console.log("App Mounted. Fetching data...");
  initTheme();
  
  if (!siteData.value) {
    await fetchSiteData();
  }
  
  // وقتی دیتا آمد، لودینگ را بردار
  isReady.value = true;
});

useHead(() => {
  return {
    title: siteData.value?.business?.name || 'Loading...',
    bodyAttrs: {
      class: 'bg-[#FDFDFD] dark:bg-[#0B0E14]'
    }
  };
});
</script>

<template>
  <div class="font-sans min-h-screen text-slate-800 dark:text-slate-200" :style="dynamicStyles">
    
    <div v-if="!siteData" class="fixed inset-0 bg-[#F2F4F6] dark:bg-[#111315] z-50 flex items-center justify-center">
      <div class="animate-pulse flex flex-col items-center">
        <div class="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
        <div class="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <span class="mt-4 text-xs text-slate-400">در حال دریافت منو...</span>
      </div>
    </div>

    <template v-else>
      <NuxtPage />
      <ProductModal />
    </template>
  </div>
</template>

<style>
body {
  font-family: 'Vazirmatn', system-ui, -apple-system, sans-serif !important;
}
.rounded-dynamic {
  border-radius: var(--border-radius) !important;
}
:root {
  --border-radius: 1.5rem;
}
/* اسکرول بار زیبا */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
:global(.dark) ::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>