<script setup>
const { siteData, startRealtimeUpdates, stopRealtimeUpdates } = useSiteData();
const searchQuery = ref('');
const activeCategory = ref('all');

onMounted(() => startRealtimeUpdates(10000));
onUnmounted(() => stopRealtimeUpdates());

const filteredData = computed(() => {
  if (!siteData.value?.categories) return [];
  let cats = JSON.parse(JSON.stringify(siteData.value.categories));
  cats = cats.filter(c => c.isActive);
  
  if (activeCategory.value !== 'all') {
    cats = cats.filter(c => c.id === activeCategory.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    cats.forEach(cat => cat.items = cat.items.filter(item => item.title.toLowerCase().includes(q)));
    cats = cats.filter(c => c.items.length > 0);
  }
  return cats;
});

// وضعیت کپی شدن رمز
const isWifiCopied = ref(false);

const copyWifiPassword = () => {
  const pass = siteData.value?.business?.wifi?.password;
  if (pass) {
    navigator.clipboard.writeText(pass);
    isWifiCopied.value = true;
    // بعد از 2 ثانیه وضعیت رو برگردون
    setTimeout(() => {
      isWifiCopied.value = false;
    }, 2000);
  }
};
</script>

<template>
  <div class="min-h-screen pb-32 bg-[#F2F4F6] dark:bg-[#111315]">

    <div 
      v-if="siteData?.appearance?.announcement?.active && siteData?.appearance?.announcement?.text"
      class="relative z-50 px-4 py-2 text-center text-xs font-bold text-white shadow-sm flex items-center justify-center gap-2 animate-fade-in-down"
      :style="{ backgroundColor: siteData.appearance.announcement.color || '#ef4444' }"
    >
      <span class="i-ph-megaphone-simple text-lg animate-tada"></span>
      {{ siteData.appearance.announcement.text }}
    </div>
    
    <header class="sticky top-0 z-40 bg-[#F2F4F6]/90 dark:bg-[#111315]/90 backdrop-blur-lg pt-4 pb-2 px-4 transition-all">
      <div class="max-w-xl mx-auto space-y-4">

        <div class="flex flex-col">
           <h1 class="font-bold text-lg dark:text-white mb-2">{{ siteData?.business?.name }}</h1>

           <div class="flex items-center gap-2 text-[10px]">
             <span class="px-2 py-0.5 rounded-full flex items-center gap-1" 
               :class="siteData?.business?.isOpen ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'">
               <span class="w-1.5 h-1.5 rounded-full" :class="siteData?.business?.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></span>
               {{ siteData?.business?.isOpen ? 'سفارش می‌پذیریم' : 'بسته' }}
             </span>
             <span v-if="siteData?.business?.isOpen && siteData?.business?.waitTime" class="text-slate-400">
               زمان انتظار: 🕒 {{ siteData.business.waitTime }}
             </span>
           </div>
        </div>
        
        <div v-if="siteData?.business?.wifi?.ssid">
          <button 
            @click="copyWifiPassword"
            class="w-full flex items-center justify-between p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/5 shadow-sm backdrop-blur-sm active:scale-[0.98] transition-all group"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-500">
                <span class="i-ph-wifi-high text-lg"></span>
              </div>
              <div class="flex flex-col items-start">
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wi-Fi رایگان</span>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ siteData.business.wifi.ssid }}</span>
              </div>
            </div>

            <div 
              class="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
              :class="isWifiCopied ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-100 dark:bg-black/20 text-slate-500 group-hover:bg-blue-500 group-hover:text-white'"
            >
              <span :class="isWifiCopied ? 'i-ph-check-bold' : 'i-ph-copy-simple'"></span>
              {{ isWifiCopied ? 'کپی شد!' : 'کپی رمز' }}
            </div>
          </button>
        </div>
        
        <div class="relative group">
          <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <span class="i-ph-magnifying-glass text-xl text-slate-400 group-focus-within:text-primary transition-colors"></span>
          </div>
          <input 
            v-model="searchQuery"
            type="text"
            class="w-full bg-white dark:bg-[#1E2025] h-14 pr-12 pl-4 rounded-[28px] shadow-sm border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-400 focus:shadow-md focus:ring-2 focus:ring-primary/20 transition-all text-lg"
            placeholder="جستجو در منو..."
          />
        </div>

        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          <button 
            @click="activeCategory = 'all'"
            class="h-10 px-6 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border"
            :class="activeCategory === 'all' 
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
              : 'bg-white dark:bg-[#1E2025] text-slate-500 border-transparent hover:border-slate-300'"
          >
            همه
          </button>
          
          <button 
            v-for="cat in siteData?.categories" 
            :key="cat.id"
            @click="activeCategory = cat.id"
            class="h-10 px-5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 border"
            :class="activeCategory === cat.id 
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
              : 'bg-white dark:bg-[#1E2025] text-slate-500 border-transparent hover:border-slate-300'"
          >
            <span>{{ cat.title }}</span>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto max-w-xl px-4 mt-2">
      <MenuGrid 
        v-if="filteredData.length > 0"
        :categories="filteredData" 
        :currency="siteData?.business?.currency" 
      />
      
      <div v-else class="flex flex-col items-center justify-center py-20 opacity-50">
        <span class="i-ph-cookie text-6xl mb-4 text-slate-300"></span>
        <p class="text-slate-500">موردی پیدا نشد</p>
      </div>
    </main>

  </div>
</template>