<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
});

const showModal = ref(true); 
</script>

<template>
  <div class="min-h-screen bg-black pb-20 pt-30 px-4">
    <div class="container-center">
      
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-white">مدیریت فایل‌ها</h1>
        <NuxtLink to="/admin" class="btn-gold px-4 py-2 text-sm">
          بازگشت به داشبورد
        </NuxtLink>
      </div>

      <div class="glass-panel p-10 text-center border border-white/10">
        <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
           <span class="i-heroicons-photo text-4xl text-primary"></span>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">گالری تصاویر سایت</h2>
        <p class="text-gray-400 mb-6">برای مدیریت تصاویر، آپلود فایل جدید یا حذف فایل‌های اضافی روی دکمه زیر کلیک کنید.</p>
        
        <button @click="showModal = true" class="btn-primary px-8 py-3 flex items-center gap-2 mx-auto">
          <span class="i-heroicons-folder-open"></span>
          باز کردن گالری
        </button>
      </div>

      <ImageManager 
        v-if="showModal" 
        modelValue="" 
        @close="showModal = false" 
      />
      
    </div>
  </div>
</template>