<template>
  <nav 
    class="fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b"
    :class="scrolled ? 'bg-black/50 backdrop-blur-xl border-white/10 py-2' : 'bg-transparent border-transparent py-4'"
  >
    <div class="container-center mx-auto">
      <div class="flex items-center justify-between">
        
        <NuxtLink to="/" class="flex items-center gap-3 group relative z-50 no-underline">
          <div class="relative w-12 h-12 rounded-full bg-white/50 flex items-center justify-center overflow-hidden border-2 border-white/10 group-hover:border-gold duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <img src="/images/ozanimage.png" alt="Ozan Academy" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-tr from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-black tracking-tight text-gold group-hover:text-white transition-colors no-underline">
              آکادمی اوزان
            </span>
            <span class="text-[10px] text-gray-400 font-light tracking-widest transition-all duration-300 no-underline">
              OZAN MUSIC ACADEMY
            </span>
          </div>
        </NuxtLink>

        <div class="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.path" 
            :to="item.path"
            class="relative px-5 py-2 text-sm font-medium text-gray-300 transition-all duration-300 rounded-full hover:text-white group no-underline"
            active-class="!text-black bg-gold shadow-[0_0_15px_rgba(204,164,59,0.4)]"
          >
            <span class="relative z-10 flex items-center gap-2">
              <span :class="item.icon" class="text-lg opacity-70 group-hover:opacity-100"></span>
              {{ item.name }}
            </span>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          
          <!-- <NuxtLink to="/admin/login" class="hidden md:flex items-center gap-2 text-xs font-bold text-gold border border-gold/30 px-4 py-2 rounded-xl hover:bg-gold hover:text-black transition-all no-underline">
            <span>پنل اساتید</span>
            <span class="i-heroicons-arrow-left"></span>
          </NuxtLink> -->

          <button 
            @click="toggleMenu" 
            class="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white active:scale-95 transition-all"
            :class="isOpen ? 'bg-gold text-white border-gold' : ''"
          >
            <span class="text-2xl transition-transform duration-300" :class="isOpen ? 'i-heroicons-x-mark rotate-90' : 'i-heroicons-bars-3-bottom-right'"></span>
          </button>
        </div>

      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div 
        v-if="isOpen" 
        class="fixed top-0 left-0 w-full h-[100dvh] z-40 bg-black/95 backdrop-blur-2xl flex flex-col pt-24 pb-10 px-0 md:hidden overflow-y-auto"
      >
        
        <div class="flex flex-col gap-3 flex-1 px-3">
          <NuxtLink 
            v-for="(item, index) in navItems" 
            :key="item.path" 
            :to="item.path"
            @click="toggleMenu"
            class="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all group no-underline"
            active-class="!bg-primary/20 !border-primary/50"
            :style="{ animation: `navSlideIn 0.5s ease-out ${index * 0.1}s forwards`, opacity: 0 }"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors" :class="$route.path === item.path ? 'text-primary' : 'text-gray-400'">
                <span :class="item.icon" class="text-xl"></span>
              </div>
              <span class="text-lg font-bold text-white">{{ item.name }}</span>
            </div>
            <span class="i-heroicons-chevron-left text-gray-500 group-hover:-translate-x-1 transition-transform"></span>
          </NuxtLink>
        </div>

        <div class="mt-8 border-t border-white/10 pt-6 space-y-4">
          <!-- <NuxtLink to="/admin/login" @click="toggleMenu" class="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gold text-black font-bold shadow-lg shadow-gold/20 active:scale-95 transition-transform no-underline">
            <span class="i-heroicons-user"></span>
            <span>ورود به پنل مدیریت</span>
          </NuxtLink> -->
          
          <div class="flex justify-center gap-6 text-gray-500">
            <a href="#" class="hover:text-white transition-colors no-underline"><span class="i-simple-icons-instagram text-2xl"></span></a>
            <a href="#" class="hover:text-white transition-colors no-underline"><span class="i-simple-icons-telegram text-2xl"></span></a>
            <a href="#" class="hover:text-white transition-colors no-underline"><span class="i-simple-icons-whatsapp text-2xl"></span></a>
          </div>
        </div>

      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const scrolled = ref(false)

const navItems = [
  { name: 'خانه', path: '/', icon: 'i-heroicons-home' },
  { name: 'اساتید', path: '/teachers', icon: 'i-heroicons-user-group' },
  { name: 'کلاس‌ها', path: '/classes', icon: 'i-heroicons-musical-note' },
  { name: 'رویدادها', path: '/events', icon: 'i-heroicons-calendar-days' },
  { name: 'تماس', path: '/contact', icon: 'i-heroicons-phone' },
]

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
@keyframes navSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>