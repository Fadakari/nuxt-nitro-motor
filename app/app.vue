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
}
</style>