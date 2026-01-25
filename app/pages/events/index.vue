<template>
  <div class="min-h-screen bg-black text-white pb-24 relative">
    
    <div class="fixed top-0 left-0 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50"></div>

    <div v-if="featuredEvent" @click="openEvent(featuredEvent)" class="relative w-full h-[65vh] flex items-end justify-start overflow-hidden group cursor-pointer border-b border-white/10">
      <div class="absolute inset-0 z-0">
        <img 
          :src="getPublicUrl(featuredEvent.image_url)" 
          class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-75 group-hover:brightness-100"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      <div class="relative z-10 container-center pb-16 w-full">
        <div class="max-w-4xl space-y-6 animate-fade-in-up">
          <div class="flex items-center gap-3">
            <span class="bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(217,4,41,0.5)]">
              ویژه و مهم
            </span>
            <span class="flex items-center gap-1 text-gold text-sm font-medium bg-black/50 px-3 py-1 rounded-full border border-gold/20">
              <span class="i-heroicons-calendar"></span>
              {{ formatDate(featuredEvent.event_date) }}
            </span>
          </div>
          
          <h1 class="text-4xl md:text-7xl font-black text-white leading-tight drop-shadow-lg">
            {{ featuredEvent.title }}
          </h1>
          
          <p class="text-lg md:text-xl text-gray-200 line-clamp-2 max-w-2xl leading-relaxed">
            {{ featuredEvent.description }}
          </p>
          
          <div class="pt-2 flex items-center gap-4">
            <button class="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 group-hover:gap-4 transition-all shadow-lg shadow-primary/20">
              <span>مشاهده جزئیات و ثبت نام</span>
              <span class="i-heroicons-arrow-left"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-center pt-16 relative z-10">
      
      <div class="flex flex-col md:flex-row items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10">
        <div>
          <h2 class="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <span class="i-heroicons-ticket text-gold"></span>
            <span class="text-gold">تقویم</span> رویدادها
          </h2>
          <p class="text-gray-400 text-sm">از آخرین کنسرت‌ها و ورکشاپ‌های ما جا نمانید.</p>
        </div>

        <div class="relative w-full md:w-80 group z-20">
          
          <div class="absolute -inset-0.5 bg-gradient-to-r from-gold to-primary rounded-xl blur opacity-20 group-focus-within:opacity-100 group-hover:opacity-60 transition duration-500"></div>
          
          <div class="relative flex items-center bg-[#0a0a0a] rounded-xl overflow-hidden">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="نام کنسرت، هنرمند یا..." 
              class="w-full bg-transparent border-none px-4 py-3.5 pl-12 text-white placeholder-gray-500 focus:ring-0 focus:outline-none transition-all"
            >
            <span class="absolute left-4 flex items-center justify-center">
              <span class="i-heroicons-magnifying-glass text-xl text-gray-500 group-focus-within:text-gold transition-colors duration-300"></span>
            </span>
          </div>

        </div>
      </div>

      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="glass-panel h-96 animate-pulse bg-white/5 rounded-2xl"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="event in otherEvents" 
          :key="event.id"
          @click="openEvent(event)"
          class="glass-panel group flex flex-col overflow-hidden hover:border-gold/50 transition-all duration-500 h-full cursor-pointer rounded-2xl bg-[#0f0f0f] hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(204,164,59,0.15)]"
        >
          <div class="h-56 relative overflow-hidden">
            <img 
              v-if="event.image_url"
              :src="getPublicUrl(event.image_url)" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-900">
              <span class="i-heroicons-musical-note text-5xl text-white/10"></span>
            </div>
            
            <div class="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-center px-3 py-2 rounded-xl shadow-lg group-hover:bg-gold group-hover:text-black transition-colors duration-300">
              <span class="block text-2xl font-black leading-none">{{ getDay(event.event_date) }}</span>
              <span class="block text-[10px] font-bold uppercase tracking-wide mt-1">{{ getMonth(event.event_date) }}</span>
            </div>
          </div>

          <div class="p-6 flex flex-col flex-grow relative">
            <div class="mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-gold"></span>
              <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">موسیقی زنده</span>
            </div>

            <h3 class="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors leading-snug">
              {{ event.title }}
            </h3>
            
            <p class="text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
              {{ event.description }}
            </p>
            
            <div class="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-sm">
              <span class="text-gray-500 flex items-center gap-1.5 group-hover:text-white transition-colors">
                <span class="i-heroicons-clock"></span>
                {{ getTime(event.event_date) }}
              </span>
              <span class="text-gold font-bold flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                مشاهده
                <span class="i-heroicons-arrow-left"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition 
      enter-active-class="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)" 
      enter-from-class="translate-y-full opacity-0" 
      enter-to-class="translate-y-0 opacity-100" 
      leave-active-class="transition duration-300 ease-in" 
      leave-from-class="translate-y-0 opacity-100" 
      leave-to-class="translate-y-full opacity-0"
    >
      <div v-if="selectedEvent" class="fixed inset-0 z-[60] bg-black flex flex-col overflow-hidden">
        
        <button @click="closeEvent" class="absolute top-6 left-6 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/20 group">
          <span class="i-heroicons-x-mark text-2xl group-hover:rotate-90 transition-transform duration-300"></span>
        </button>

        <div class="h-[45vh] w-full relative flex-shrink-0">
          <img v-if="selectedEvent.image_url" :src="getPublicUrl(selectedEvent.image_url)" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div class="absolute bottom-0 right-0 w-full p-6 md:p-12">
            <div class="container-center">
              <span class="bg-gold text-black text-xs font-bold px-3 py-1 rounded-md mb-4 inline-block shadow-[0_0_15px_#CCA43B]">
                {{ formatDate(selectedEvent.event_date) }}
              </span>
              <h1 class="text-3xl md:text-5xl font-black text-white leading-tight">
                {{ selectedEvent.title }}
              </h1>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-black pb-20 custom-scrollbar">
          <div class="container-center py-10 px-6 max-w-4xl mx-auto">
            <p class="text-xl text-gray-200 font-medium leading-relaxed mb-10 border-r-4 border-gold pr-6">
              {{ selectedEvent.description }}
            </p>
            <div class="text-gray-400 leading-9 whitespace-pre-line text-justify text-lg font-light">
              {{ selectedEvent.content || 'توضیحات تکمیلی برای این رویداد ثبت نشده است.' }}
            </div>
            <div class="mt-16 pt-10 border-t border-white/10 flex justify-center">
               <NuxtLink to="/contact" class="btn-primary py-4 px-10 rounded-2xl font-bold text-lg shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all">
                 رزرو و خرید بلیط
               </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const selectedEvent = ref(null)
const searchQuery = ref('')

const { data: events, pending } = await useAsyncData('all_events', async () => {
  const { data } = await client.from('events').select('*').order('event_date', { ascending: false })
  return data || []
})

const featuredEvent = computed(() => {
  if (!events.value) return null
  return events.value.find(e => e.is_important) || events.value[0]
})
const otherEvents = computed(() => {
  if (!events.value) return []
  
  // اول رویداد ویژه را جدا می‌کنیم
  let result = events.value
  if (featuredEvent.value) {
    result = result.filter(e => e.id !== featuredEvent.value.id)
  }

  // حالا اگر متنی جستجو شده باشد، فیلتر می‌کنیم
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(e => 
      e.title.toLowerCase().includes(query) || 
      (e.description && e.description.toLowerCase().includes(query))
    )
  }

  return result
})

const openEvent = (event: any) => {
  selectedEvent.value = event
  document.body.style.overflow = 'hidden'
}
const closeEvent = () => {
  selectedEvent.value = null
  document.body.style.overflow = ''
}

const getPublicUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const { data } = client.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
const getDay = (d) => d ? new Date(d).toLocaleDateString('fa-IR', { day: 'numeric' }) : ''
const getMonth = (d) => d ? new Date(d).toLocaleDateString('fa-IR', { month: 'long' }) : ''
const getTime = (d) => d ? new Date(d).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : ''
</script>