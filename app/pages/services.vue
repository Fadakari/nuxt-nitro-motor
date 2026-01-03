<template>
  <div class="min-h-screen pt-24 pb-12 px-4 sm:px-6">
    
    <div class="container-center mb-12 text-center space-y-4">
      <h1 class="text-4xl font-bold text-white mb-2">
        <span class="text-primary border-b-2 border-primary pb-1 ml-2">اساتید</span>
        <span class="text-gold">برجسته ما</span>
      </h1>
      <p class="text-gray-400 max-w-2xl mx-auto">
        با بهترین مدرسین موسیقی کشور آشنا شوید و مسیر هنری خود را انتخاب کنید.
      </p>
    </div>

    <div v-if="pending" class="container-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 3" :key="i" class="glass-panel h-96 animate-pulse">
        <div class="h-48 bg-white/5 w-full rounded-t-2xl"></div>
        <div class="p-6 space-y-3">
          <div class="h-6 bg-white/10 rounded w-1/2"></div>
          <div class="h-4 bg-white/10 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    <div v-else class="container-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <div 
        v-for="teacher in teachers" 
        :key="teacher.id"
        class="group glass-panel relative overflow-hidden transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(204,164,59,0.15)]"
      >
        <div class="relative h-64 overflow-hidden rounded-t-2xl bg-gradient-to-b from-gray-800 to-black">
          <img 
            v-if="teacher.image_url"
            :src="getPublicUrl(teacher.image_url)" 
            :alt="teacher.full_name"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-white/5">
            <span class="i-heroicons-user text-6xl text-white/20"></span>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          
          <div class="absolute bottom-4 right-4">
            <span class="px-3 py-1 text-xs font-bold text-black bg-gold rounded-full shadow-lg">
              {{ teacher.specialty || 'مدرس موسیقی' }}
            </span>
          </div>
        </div>

        <div class="p-6 relative z-10">
          <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
            {{ teacher.full_name }}
          </h3>
          
          <p class="text-sm text-gray-400 line-clamp-3 mb-6 leading-relaxed">
            {{ teacher.bio || 'توضیحات تکمیلی به زودی اضافه می‌شود.' }}
          </p>

          <button class="w-full btn-gold flex items-center justify-center gap-2 text-sm group-hover:bg-gold group-hover:text-black">
            <span>مشاهده کلاس‌ها</span>
            <span class="i-heroicons-chevron-left text-lg"></span>
          </button>
        </div>

      </div>

    </div>

    <div v-if="!pending && (!teachers || teachers.length === 0)" class="text-center py-20 text-gray-500">
      <span class="i-heroicons-face-frown text-6xl mb-4 block mx-auto opacity-50"></span>
      <p>هنوز استادی به سیستم اضافه نشده است.</p>
    </div>

  </div>
</template>

<script setup lang="ts">
// اتصال به Supabase
const client = useSupabaseClient()
const config = useRuntimeConfig()

// دریافت لیست اساتید از دیتابیس
const { data: teachers, pending } = await useAsyncData('teachers', async () => {
  const { data, error } = await client
    .from('teachers')
    .select('*')
    .eq('is_active', true) // فقط اساتید فعال
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching teachers:', error)
    return []
  }
  return data
})

// تابع کمکی برای ساخت لینک عکس
// این تابع اسم فایل را می‌گیرد و آدرس کامل دانلود را می‌دهد
const getPublicUrl = (path: string) => {
  if (!path) return ''
  // اگر لینک کامل بود خودش را برگردان، اگر نه لینک Storage را بساز
  if (path.startsWith('http')) return path
  
  const { data } = client.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}
</script>