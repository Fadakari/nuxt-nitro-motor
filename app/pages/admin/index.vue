<template>
  <div class="min-h-screen bg-black pb-20">
    
    <header class="bg-white/5 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
      <div class="container-center h-16 flex items-center justify-between">
        <h1 class="text-lg font-bold text-white flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          پنل مدیریت
        </h1>
        <button @click="handleLogout" class="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
          <span>خروج</span>
          <span class="i-heroicons-arrow-right-on-rectangle"></span>
        </button>
      </div>
    </header>

    <div class="container-center py-8 space-y-8">
      
      <div class="space-y-1">
        <p class="text-gray-400 text-sm">خوش آمدید،</p>
        <h2 class="text-2xl font-bold text-white">مدیر آموزشگاه</h2>
      </div>

      <div class="grid grid-cols-2 gap-4">
        
        <NuxtLink to="/admin/teachers" class="glass-panel p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 active:scale-95 transition-all cursor-pointer group border border-white/10">
          <div class="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-colors text-gold">
            <span class="i-heroicons-user-group text-3xl"></span>
          </div>
          <span class="text-white font-bold">اساتید</span>
          <span class="text-xs text-gray-500">افزودن و ویرایش</span>
        </NuxtLink>

        <NuxtLink to="/admin/classes" class="glass-panel p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 active:scale-95 transition-all cursor-pointer group border border-white/10">
          <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
            <span class="i-heroicons-musical-note text-3xl"></span>
          </div>
          <span class="text-white font-bold">کلاس‌ها</span>
          <span class="text-xs text-gray-500">قیمت و ظرفیت</span>
        </NuxtLink>

        <NuxtLink to="/admin/events" class="glass-panel p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 active:scale-95 transition-all cursor-pointer group border border-white/10">
          <div class="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors text-purple-400">
            <span class="i-heroicons-calendar text-3xl"></span>
          </div>
          <span class="text-white font-bold">رویدادها</span>
          <span class="text-xs text-gray-500">اخبار و کنسرت</span>
        </NuxtLink>

        <NuxtLink to="/" class="glass-panel p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 active:scale-95 transition-all cursor-pointer group border border-white/10">
          <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-400">
            <span class="i-heroicons-eye text-3xl"></span>
          </div>
          <span class="text-white font-bold">مشاهده سایت</span>
          <span class="text-xs text-gray-500">برگشت به خانه</span>
        </NuxtLink>

        <NuxtLink to="/admin/registrations" class="glass-panel p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 active:scale-95 transition-all cursor-pointer group border border-white/10">
          <div class="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors text-green-400">
            <span class="i-heroicons-clipboard-document-list text-3xl"></span>
          </div>
          <span class="text-white font-bold">ثبت‌نام‌ها</span>
          <span class="text-xs text-gray-500">مشاهده درخواست‌ها</span>
        </NuxtLink>

        <NuxtLink to="/admin/categories" class="glass-panel p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 active:scale-95 transition-all cursor-pointer group border border-white/10">
          <div class="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors text-green-400">
            <span class="i-heroicons-clipboard-document-list text-3xl"></span>
          </div>
          <span class="text-white font-bold">دسته بندی کلاس ها</span>
          <span class="text-xs text-gray-500">اضافه، ویرایش یا حذف دسته بندی ها</span>
        </NuxtLink>

        <NuxtLink to="/admin/media" class="glass-panel p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group text-center no-underline border border-white/10">
          <div class="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="i-heroicons-photo text-cyan-400 text-xl"></span>
          </div>
          <span class="text-sm font-bold text-gray-200">گالری تصاویر</span>
          <span class="text-[10px] text-gray-500">آپلود و حذف فایل</span>
        </NuxtLink>

      </div>

      <div class="glass-panel p-6 border border-white/10">
        <h3 class="text-white font-bold mb-4 flex items-center gap-2">
          <span class="i-heroicons-chart-bar text-gold"></span>
          وضعیت سیستم
        </h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center text-sm border-b border-white/5 pb-2">
             <span class="text-gray-400">اتصال دیتابیس</span>
             <span class="text-green-400 flex items-center gap-1">
               <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
               متصل
             </span>
          </div>
           <div class="flex justify-between items-center text-sm">
             <span class="text-gray-400">نسخه سیستم</span>
             <span class="text-white font-mono">v1.0.0</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// محافظت از صفحه (اگر لاگین نبود پرت بشه بیرون)
definePageMeta({
  middleware: 'auth'
})

// ماژول احراز هویت
const client = useSupabaseClient()
const router = useRouter()

// چک کردن وضعیت لاگین هنگام ورود به صفحه
onMounted(async () => {
  const { data } = await client.auth.getSession()
  if (!data.session) {
    router.push('/admin/login')
  }
})

const handleLogout = async () => {
  await client.auth.signOut()
  router.push('/admin/login')
}
</script>