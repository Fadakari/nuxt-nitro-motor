<style scoped>
  /* انیمیشن باز شدن مودال */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* اسکرول بار اختصاصی داخل مودال */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D90429;
}
</style>
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

        <div class="flex flex-wrap flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select v-model="selectedInstrument" class="bg-black border border-white/10 rounded-xl px-4 py-2 w-[100%] text-white focus:border-gold outline-none">
            <option value="">همه سازها</option>
            <option v-for="inst in instruments" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
          </select>

          <div class="relative w-[100%] md:w-80 group z-20">
          
            <div class="absolute -inset-0.5 bg-gradient-to-r from-gold to-primary rounded-xl blur opacity-20 group-focus-within:opacity-100 group-hover:opacity-60 transition duration-500"></div>
            
            <div class="relative flex items-center bg-[#0a0a0a] rounded-xl overflow-hidden">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="نام کنسرت، هنرمند یا..." 
                class="w-[100%] bg-transparent border-none px-4 py-3.5 pl-12 text-white placeholder-gray-500 focus:ring-0 focus:outline-none transition-all"
              >
              <span class="absolute left-4 flex items-center justify-center">
                <span class="i-heroicons-magnifying-glass text-xl text-gray-500 group-focus-within:text-gold transition-colors duration-300"></span>
              </span>
            </div>

          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="teacher in filteredTeachers" 
          :key="teacher.id"
          @click="openTeacherProfile(teacher)"
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

  <Transition 
  enter-active-class="transition duration-300 ease-out"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"
  leave-active-class="transition duration-200 ease-in"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
  <div v-if="selectedTeacher" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
    
    <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="closeTeacherProfile"></div>

    <div class="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-scale-in">
      
      <button @click="closeTeacherProfile" class="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
        <span class="i-heroicons-x-mark text-xl"></span>
      </button>

      <div class="w-full md:w-2/5 h-64 md:h-auto relative">
        <img 
          v-if="selectedTeacher.image_url"
          :src="getPublicUrl(selectedTeacher.image_url)" 
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center">
          <span class="i-heroicons-user text-6xl text-white/20"></span>
        </div>
        
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-l md:from-[#0a0a0a]"></div>
        
        <div class="absolute bottom-4 right-4 md:hidden">
          <h2 class="text-2xl font-bold text-white">{{ selectedTeacher.full_name }}</h2>
          <p class="text-gold text-sm font-medium mt-1">مدرس آکادمی اوزان</p>
        </div>
      </div>

      <div class="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto custom-scrollbar">
        
        <div class="hidden md:block mb-8 border-b border-white/10 pb-6">
          <h2 class="text-4xl font-black text-white mb-2 tracking-tight">{{ selectedTeacher.full_name }}</h2>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-gold font-medium tracking-wide text-sm uppercase">عضو رسمی دپارتمان موسیقی</span>
          </div>
        </div>

        <div class="mb-8">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span class="i-heroicons-musical-note"></span>
            تخصص‌ها
          </h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="rel in selectedTeacher.teacher_instruments" 
              :key="rel.instruments?.id"
              class="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:border-gold/50 hover:text-gold transition-colors cursor-default"
            >
              {{ rel.instruments?.name }}
            </span>
          </div>
        </div>

        <div class="prose prose-invert max-w-none">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span class="i-heroicons-academic-cap"></span>
            درباره استاد
          </h3>
          <p class="text-gray-300 leading-8 whitespace-pre-line text-justify text-sm md:text-base font-light">
            {{ selectedTeacher.bio || 'رزومه‌ای برای این استاد ثبت نشده است.' }}
          </p>
        </div>

        <div class="mt-10 pt-6 pe-8 border-t border-white/10 flex justify-end">
          <NuxtLink 
            :to="{ path: '/classes', query: { teacher: selectedTeacher.id } }" 
            class="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <span>مشاهده کلاس‌های این استاد</span>
            <span class="i-heroicons-arrow-left"></span>
          </NuxtLink>
        </div>

      </div>

    </div>
  </div>
</Transition>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const searchQuery = ref('')
const selectedInstrument = ref('')
const selectedTeacher = ref(null)

// تابع باز کردن مودال
const openTeacherProfile = (teacher: any) => {
  selectedTeacher.value = teacher
  document.body.style.overflow = 'hidden' // قفل کردن اسکرول صفحه
}

// تابع بستن مودال
const closeTeacherProfile = () => {
  selectedTeacher.value = null
  document.body.style.overflow = '' // آزاد کردن اسکرول
}

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