<template>
  <header 
    class="fixed top-0 left-0 right-0 z-30 transition-all duration-300 ease-in-out px-4 md:px-8"
    :class="isScrolled ? 'py-3 bg-white/70 dark:bg-dark/70 backdrop-blur-xl shadow-sm' : 'py-6 bg-transparent'"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <div class="flex items-center gap-2 cursor-pointer select-none group" @click="$emit('change', 'home')">
        <div class="relative w-10 h-10 flex items-center justify-center bg-dark-900 dark:bg-white rounded-xl text-white overflow-hidden transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 shadow-lg shadow-slate-900/20">
          <span class="font-black text-xl relative z-10 dark:text-dark">B</span>
          <div class="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-slate-900 dark:text-slate-200 text-lg leading-none tracking-tight">
            {{ siteData?.general?.siteTitle || 'نام شما' }}
          </span>
          <span class="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-0.5">Portfolio</span>
        </div>
      </div>

      
      <div class="flex items-center gap-4">
        <button v-if="isMobile" @click="toggleTheme" class="w-10 h-10 rounded-full border-1 flex items-center justify-center dark:bg-black/9 transition-colors hover:bg-black/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 mr-2">
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
        <button 
          v-if="isMobile" 
          @click="mobileMenuOpen = true"
          class="p-2 rounded-xl backdrop-blur-[15px] bg-dark/30 dark:bg-dark/30 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      <div v-if="!isMobile" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inset-shadow-sm">
        <div class="flex p-1.5 rounded-2xl transition-all duration-300"
              :class="isScrolled 
                ? 'bg-transparent border-transparent shadow-none' 
                : 'bg-slate-100/80 dark:bg-dark/80 backdrop-blur-sm border border-white/50 shadow-inner'">
          <NuxtLink 
              v-for="tab in tabs" 
              :key="tab.id"
              :to="tab.to"
              class="nav-btn relative px-6 py-2.5 mx-1 rounded-xl transition-all duration-300 group flex items-center justify-center whitespace-nowrap no-underline hover:bg-slate-200/50 dark:hover:bg-white/5"
              active-class="shadow-inner bg-slate-200/50 dark:bg-white/5"
          >
              <template #default="{ isActive }">
                 <div v-if="isActive" class="absolute inset-0 bg-white dark:bg-white/10 backdrop-blur-[10px] rounded-xl z-0 shadow-sm border border-white/20"></div>
                 
                 <span class="relative z-10 flex items-center gap-2" 
                       :class="isActive ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'">
                     <span>{{ tab.icon }}</span>
                     {{ tab.label }}
                 </span>
              </template>
          </NuxtLink>

          <button @click="toggleTheme" class="w-10 h-10 rounded-full border-1 flex items-center justify-center dark:bg-black/9 transition-colors hover:bg-black/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 mr-2">
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>
      </div>

      

    </div>
    <Teleport to="body">
      <Transition name="mobile-menu">
        <div v-if="isMobile && mobileMenuOpen" 
             class="fixed inset-0 z-[100] flex flex-col backdrop-blur-[15px]"
             @click.self="mobileMenuOpen = false">

          <div class="flex items-center justify-between p-6 border-b border-slate-100">
            <span class="font-black text-2xl text-slate-900 dark:text-slate-300">منو</span>

            <button @click="mobileMenuOpen = false" class="p-2 pb-1 rounded-full bg-slate-50 dark:bg-dark/70 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors border-none outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 flex flex-col gap-3 p-6 overflow-y-auto">
            <NuxtLink 
                v-for="(tab, i) in tabs" 
                :key="tab.id"
                :to="tab.to"
                @click="mobileMenuOpen = false" 
                class="group relative w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border-2 active:scale-95 overflow-hidden isolate animate-slide-in-right opacity-0 no-underline"
                active-class="bg-red-700/70 dark:bg-red-700/40 border-red-700 text-white dark:text-slate-200 shadow-xl shadow-red-700/30"
                :class="$route.path !== tab.to ? 'bg-white/80 dark:bg-dark/80 border-slate-100 dark:border-slate-100/40 text-slate-600 dark:text-slate-400 hover:border-red-200 hover:bg-red-50/50' : ''"
                :style="{ animationDelay: `${i * 100}ms` }"
            >
                <template #default="{ isActive }">
                    <div v-if="isActive" class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-30 -skew-x-12 translate-x-[-100%] animate-shine"></div>
                
                    <span class="text-2xl transition-transform duration-300 group-hover:scale-110"
                          :class="isActive ? 'opacity-100' : 'opacity-70 grayscale group-hover:grayscale-0'">
                      {{ tab.icon }}
                    </span>
                  
                    <span class="text-lg font-bold tracking-wide">{{ tab.label }}</span>
                  
                    <span v-if="!isActive" class="mr-auto text-slate-300 group-hover:text-red-400 group-hover:-translate-x-1 transition-all">
                      ←
                    </span>
                  
                    <span v-if="isActive" class="mr-auto w-2.5 h-2.5 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse"></span>
                </template>
            </NuxtLink>
          </div>

          <div class="p-6 bg-slate-50">
            <p class="text-center text-slate-400 text-sm">© 2025 Behzad Heydari</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const { siteData } = useSiteData();

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};


defineProps(['active']);
const emit = defineEmits(['change']);

const tabs = [
  { id: 'home', label: 'خانه', icon: '🏠', to: '/' },
  { id: 'about', label: 'درباره من', icon: '👤', to: '/about' },
  { id: 'services', label: 'فعالیت‌های من', icon: '⚡', to: '/services' },
  { id: 'blog', label: 'مقالات', icon: '📝', to: '/blog' },
  { id: 'contact', label: 'ارتباط', icon: '📞', to: '/contact' }
];

const isMobile = ref(false);
const mobileMenuOpen = ref(false);
const isScrolled = ref(false);

const checkScreen = () => { isMobile.value = window.innerWidth < 768; };

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const selectMobile = (id) => {
  emit('change', id);
  setTimeout(() => { mobileMenuOpen.value = false; }, 200);
};

onMounted(() => {
  checkScreen();
  window.addEventListener('resize', checkScreen);
  window.addEventListener('scroll', handleScroll);

  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform, opacity;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

@keyframes shine {
  0% { transform: translateX(150%) skewX(-12deg); }
  100% { transform: translateX(-250%) skewX(-12deg); }
}

.animate-shine {
  animation: shine 3s infinite ease-in-out;
  will-change: transform;
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
.nav-btn {
  cursor: pointer;
}
</style>