<template>
  <div class="relative w-full min-h-screen overflow-hidden bg-black text-white">
    
    <div class="absolute inset-0 z-0">
      <img 
        src="/ourpicture.jpg" 
        alt="Ozan Academy Atmosphere" 
        class="w-full h-full object-cover opacity-60"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
    </div>

    <div class="relative z-10 container-center flex flex-col justify-center min-h-screen py-20">
      <div class="max-w-3xl space-y-6 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-gold/30">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span class="text-xs font-bold tracking-wider text-gold uppercase">استعدادیابی و آموزش حرفه‌ای</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-black leading-tight">
          <span class="block text-white mb-2">صدای هنر،</span>
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-gold via-gold-light to-gold drop-shadow-lg">
            در اوج ظرافت
          </span>
        </h1>
        <p class="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-xl">
          آکادمی موسیقی اوزان؛ جایی که نت‌ها جان می‌گیرند. با برترین اساتید و متد‌های روز دنیا، مسیر هنری خود را آغاز کنید.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <NuxtLink to="/classes" class="btn-primary no-underline flex items-center justify-center gap-3 text-lg py-4 px-8 group">
            <span>شروع ثبت‌نام</span>
            <span class="i-heroicons-arrow-left group-hover:-translate-x-1 transition-transform"></span>
          </NuxtLink>
          <NuxtLink to="/services" class="btn-gold no-underline flex items-center justify-center gap-3 text-lg py-4 px-8 backdrop-blur-sm bg-black/20">
            <span>مشاهده اساتید</span>
            <span class="i-heroicons-users"></span>
          </NuxtLink>
        </div>
      </div>

      <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-200">
        <div class="glass-panel p-6 hover:bg-white/5 transition-colors cursor-default group">
          <div class="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <span class="i-heroicons-academic-cap text-2xl text-gold"></span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">اساتید برجسته</h3>
          <p class="text-sm text-gray-400 leading-relaxed">آموزش زیر نظر اساتید فارغ‌التحصیل موسیقی و با تجربه اجرایی بالا.</p>
        </div>
        <div class="glass-panel p-6 hover:bg-white/5 transition-colors cursor-default group">
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <span class="i-heroicons-clock text-2xl text-primary"></span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">برنامه منعطف</h3>
          <p class="text-sm text-gray-400 leading-relaxed">انتخاب روز و ساعت کلاس‌ها متناسب با برنامه زمانی شما به صورت آنلاین.</p>
        </div>
        <div class="glass-panel p-6 hover:bg-white/5 transition-colors cursor-default group">
          <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <span class="i-heroicons-trophy text-2xl text-white"></span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">مدرک معتبر</h3>
          <p class="text-sm text-gray-400 leading-relaxed">ارائه گواهی پایان دوره معتبر جهت رزومه هنری و کنسرت‌های هنرجویی.</p>
        </div>
      </div>
    </div>

    <div class="relative z-10 bg-black/80 backdrop-blur-xl border-t border-white/10 py-20">
      <div class="container-center">
        
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl font-bold text-white mb-2">
              <span class="text-primary ml-2">رویدادهای</span>
              <span class="text-gold">ویژه</span>
            </h2>
            <p class="text-gray-400 text-sm">تازه ترین اخبار، کنسرت‌ها و مسترکلس‌های اوزان</p>
          </div>
          <NuxtLink to="/events" class="hidden sm:flex items-center gap-2 text-gold hover:text-white transition-colors text-sm font-bold">
            <span>آرشیو رویدادها</span>
            <span class="i-heroicons-arrow-left"></span>
          </NuxtLink>
        </div>

        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div v-for="i in 2" :key="i" class="glass-panel h-48 animate-pulse bg-white/5"></div>
        </div>

        <div v-else-if="events && events.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            v-for="event in events" 
            :key="event.id" 
            class="group glass-panel flex flex-col sm:flex-row overflow-hidden hover:border-gold/50 transition-all duration-300"
          >
            <div class="sm:w-2/5 h-48 sm:h-auto relative bg-gray-800">
              <img 
                v-if="event.image_url" 
                :src="getPublicUrl(event.image_url)" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-white/5">
                <span class="i-heroicons-calendar text-4xl text-white/20"></span>
              </div>
              <div class="absolute top-2 right-2 bg-black/80 backdrop-blur text-gold text-xs font-bold px-2 py-1 rounded-lg border border-gold/20">
                ویژه
              </div>
            </div>

            <div class="p-6 flex flex-col justify-center sm:w-3/5">
              <h3 class="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {{ event.title }}
              </h3>
              <p class="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                {{ event.description }}
              </p>
              <div class="mt-auto">
                <button class="text-gold text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  <span>جزئیات بیشتر</span>
                  <span class="i-heroicons-chevron-left text-xs"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-10 border border-dashed border-white/10 rounded-2xl">
          <p class="text-gray-500">در حال حاضر رویداد مهمی فعال نیست.</p>
        </div>

      </div>
    </div>

    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 blur-[100px] rounded-full pointer-events-none"></div>

  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}
.delay-200 { animation-delay: 0.2s; }
@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}
</style>

<script setup lang="ts">
// دریافت رویدادهای مهم از دیتابیس
const client = useSupabaseClient()

const { data: events, pending } = await useAsyncData('important-events', () => 
  $fetch('/api/events-cached'), 
{
  lazy: true,
  server: false
})

// تابع عکس
const getPublicUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const { data } = client.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}
</script>