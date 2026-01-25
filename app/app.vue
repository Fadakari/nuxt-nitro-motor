<template>
  <div class="font-sans min-h-screen bg-black text-white">
    <Transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <GlobalLoader v-if="isLoading" />
    </Transition>
    <NavBar />
    
    <NuxtPage />
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue'

const nuxtApp = useNuxtApp()
const isLoading = ref(false)

nuxtApp.hook('page:start', () => {
  isLoading.value = true
})
nuxtApp.hook('page:finish', () => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | آموزشگاه موسیقی اوزان` : 'آموزشگاه موسیقی اوزان';
  },
  bodyAttrs: {
    class: 'bg-black text-white dir-rtl'
  }
})
</script>

<style>
/* استایل‌های پایه */
body {
  background-color: #000000;
  color: #eeeeee;
  margin: 0;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 6px; /* ضخامت خیلی نازک */
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a; /* رنگ پس‌زمینه ریل اسکرول (تیره) */
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #856A20, #CCA43B); /* گرادینت طلایی */
  border-radius: 10px; /* گرد کردن لبه‌ها */
  border: 1px solid rgba(0,0,0,0.3); /* فاصله جزئی برای زیبایی */
}

::-webkit-scrollbar-thumb:hover {
  background: #E5C15D; /* رنگ روشن‌تر هنگام هاور */
}

/* برای فایرفاکس */
* {
  scrollbar-width: thin;
  scrollbar-color: #CCA43B #0a0a0a;
}
</style>