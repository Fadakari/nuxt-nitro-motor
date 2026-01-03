<template>
  <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-500">
    
    <div class="flex items-end gap-1 h-16 mb-6">
      <div class="w-2 bg-gradient-to-t from-primary to-gold rounded-full animate-music-bar" style="animation-delay: 0.1s"></div>
      <div class="w-2 bg-gradient-to-t from-primary to-gold rounded-full animate-music-bar" style="animation-delay: 0.3s"></div>
      <div class="w-2 bg-gradient-to-t from-primary to-gold rounded-full animate-music-bar" style="animation-delay: 0.5s"></div>
      <div class="w-2 bg-gradient-to-t from-primary to-gold rounded-full animate-music-bar" style="animation-delay: 0.2s"></div>
      <div class="w-2 bg-gradient-to-t from-primary to-gold rounded-full animate-music-bar" style="animation-delay: 0.4s"></div>
    </div>

    <div class="text-center space-y-2">
      <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-gold animate-pulse">
        آکادمی اوزان
      </h2>
      <p class="text-gray-500 text-xs tracking-[0.2em] uppercase">در حال بارگذاری...</p>
    </div>

  </div>
</template>

<style scoped>
@keyframes music-bar {
  0%, 100% { height: 20%; opacity: 0.5; }
  50% { height: 100%; opacity: 1; box-shadow: 0 0 15px #cca43b; }
}

.animate-music-bar {
  animation: music-bar 1s ease-in-out infinite;
}
</style>