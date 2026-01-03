<template>
  <div class="min-h-screen pt-24 pb-12 px-4 sm:px-6 relative">
    
    <div class="container-center space-y-8 relative z-10">
      
      <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">
            <span class="text-gold">اساتید</span> آکادمی
          </h1>
          <p class="text-gray-400 text-sm">مدرسین حرفه‌ای ما را بر اساس ساز یا نام جستجو کنید.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select v-model="selectedInstrument" class="bg-black border border-white/10 rounded-xl px-4 py-2 w-[75%] text-white focus:border-gold outline-none">
            <option value="">همه سازها</option>
            <option v-for="inst in instruments" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
          </select>

          <div class="relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="جستجوی نام استاد..." 
              class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-white focus:border-gold outline-none w-[75%]"
            />
            <span class="i-heroicons-magnifying-glass absolute right-3 top-2.5 text-gray-400"></span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="teacher in filteredTeachers" 
          :key="teacher.id"
          class="glass-panel group relative overflow-hidden hover:border-gold/50 transition-all duration-300"
        >
          <div class="h-64 overflow-hidden relative">
            <img 
              v-if="teacher.image_url"
              :src="getPublicUrl(teacher.image_url)" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div v-else class="w-full h-full bg-white/5 flex items-center justify-center">
              <span class="i-heroicons-user text-6xl text-white/20"></span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          <div class="p-5">
            <h3 class="text-xl font-bold text-white mb-1">{{ teacher.full_name }}</h3>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="rel in teacher.teacher_instruments" 
                :key="rel.instruments.id"
                class="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-md"
              >
                {{ rel.instruments.name }}
              </span>
            </div>

            <p class="text-gray-400 text-sm line-clamp-2 mb-4">{{ teacher.bio }}</p>
            
            <button class="w-full btn-gold text-sm py-2 group-hover:bg-gold group-hover:text-black">
              رزومه کامل
            </button>
          </div>
        </div>
      </div>
       
       <div v-if="filteredTeachers.length === 0" class="text-center text-gray-500 py-10">
         نتیجه‌ای با این مشخصات یافت نشد.
       </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const searchQuery = ref('')
const selectedInstrument = ref('')

// دریافت همزمان اساتید و سازها
const { data: instruments } = await useAsyncData('instruments', async () => {
  const { data } = await client.from('instruments').select('*')
  return data || []
})

const { data: teachers } = await useAsyncData('teachers-full', async () => {
  // نکته: اینجا از رابطه تو در تو استفاده میکنیم تا نام سازها رو هم بگیریم
  const { data } = await client
    .from('teachers')
    .select('*, teacher_instruments(instruments(id, name))')
    .eq('is_active', true)
  return data || []
})

// فیلترینگ کلاینت‌ساید (سریع و آنی)
const filteredTeachers = computed(() => {
  if (!teachers.value) return []
  
  return teachers.value.filter(t => {
    // 1. فیلتر نام
    const matchName = t.full_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 2. فیلتر ساز
    let matchInstrument = true
    if (selectedInstrument.value) {
      // چک میکنیم آیا در لیست سازهای این استاد، آیدی انتخاب شده وجود دارد؟
      matchInstrument = t.teacher_instruments.some((rel: any) => rel.instruments.id === selectedInstrument.value)
    }

    return matchName && matchInstrument
  })
})

const getPublicUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const { data } = client.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}
</script>