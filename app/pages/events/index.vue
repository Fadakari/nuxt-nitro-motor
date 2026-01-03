<template>
  <div class="min-h-screen bg-black text-white pb-20">
    
    <div v-if="featuredEvent" @click="openEvent(featuredEvent)" class="relative w-full h-[60vh] flex items-end justify-start overflow-hidden group cursor-pointer">
      <div class="absolute inset-0 z-0">
        <img 
          :src="getPublicUrl(featuredEvent.image_url)" 
          class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>
      <div class="relative z-10 container-center pb-12 w-full">
        <div class="max-w-3xl space-y-4 animate-fade-in-up">
          <span class="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            رویداد ویژه
          </span>
          <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight">
            {{ featuredEvent.title }}
          </h1>
          <p class="text-lg text-gray-300 line-clamp-2">
            {{ featuredEvent.description }}
          </p>
          <div class="pt-4">
             <span class="text-gold text-sm font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                مشاهده جزئیات کامل <span class="i-heroicons-arrow-left"></span>
             </span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-center pt-16 relative z-10">
      <div class="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
        <h2 class="text-3xl font-bold text-white">
          <span class="text-gold">آرشیو</span> اخبار و کنسرت‌ها
        </h2>
      </div>

      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="glass-panel h-80 animate-pulse bg-white/5"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="event in otherEvents" 
          :key="event.id"
          @click="openEvent(event)"
          class="glass-panel group flex flex-col overflow-hidden hover:border-gold/40 transition-all duration-300 h-full cursor-pointer"
        >
          <div class="h-48 relative overflow-hidden bg-gray-900">
            <img v-if="event.image_url" :src="getPublicUrl(event.image_url)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            <div v-else class="w-full h-full flex items-center justify-center"><span class="i-heroicons-musical-note text-4xl text-white/20"></span></div>
            <div class="absolute top-3 right-3 bg-black/80 backdrop-blur text-center px-3 py-2 rounded-xl border border-white/10 shadow-xl">
              <span class="block text-xl font-bold text-gold">{{ getDay(event.event_date) }}</span>
              <span class="block text-xs text-gray-400 uppercase">{{ getMonth(event.event_date) }}</span>
            </div>
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">{{ event.title }}</h3>
            <p class="text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">{{ event.description }}</p>
            <div class="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
              <span class="text-xs text-gray-500 flex items-center gap-1"><span class="i-heroicons-clock"></span>{{ getTime(event.event_date) }}</span>
              <button class="text-gold text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>جزئیات</span><span class="i-heroicons-arrow-left"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition 
      enter-active-class="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)" 
      enter-from-class="translate-y-full opacity-0 scale-95" 
      enter-to-class="translate-y-0 opacity-100 scale-100" 
      leave-active-class="transition duration-300 ease-in" 
      leave-from-class="translate-y-0 opacity-100 scale-100" 
      leave-to-class="translate-y-full opacity-0 scale-95"
    >
      <div v-if="selectedEvent" class="fixed inset-0 z-[60] bg-black flex flex-col overflow-hidden">
        
        <button @click="closeEvent" class="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/20">
          <span class="i-heroicons-x-mark text-2xl"></span>
        </button>

        <div class="h-[40vh] md:h-[50vh] w-full relative flex-shrink-0">
          <img v-if="selectedEvent.image_url" :src="getPublicUrl(selectedEvent.image_url)" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div class="absolute bottom-0 right-0 w-full p-6 md:p-12">
            <div class="container-center">
              <span class="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                {{ formatDate(selectedEvent.event_date) }}
              </span>
              <h1 class="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                {{ selectedEvent.title }}
              </h1>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-black pb-20">
          <div class="container-center py-8 md:py-12 px-6 max-w-4xl mx-auto">
            
            <p class="text-lg text-gray-300 font-medium leading-relaxed mb-8 border-l-4 border-gold pl-4 ml-4">
              {{ selectedEvent.description }}
            </p>

            <div class="text-gray-400 leading-8 whitespace-pre-line text-justify">
              {{ selectedEvent.content || 'توضیحات تکمیلی برای این رویداد ثبت نشده است.' }}
            </div>

            <div class="mt-12 pt-8 border-t border-white/10 flex justify-center">
               <NuxtLink to="/contact" class="btn-primary py-3 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/40 transition-all">
                 هماهنگی و رزرو
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

// استیت‌ها
const selectedEvent = ref(null)

// دریافت رویدادها
const { data: events, pending } = await useAsyncData('all_events', async () => {
  const { data } = await client
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })
  return data || []
})

const featuredEvent = computed(() => {
  if (!events.value) return null
  return events.value.find(e => e.is_important) || events.value[0]
})

const otherEvents = computed(() => {
  if (!events.value) return []
  if (!featuredEvent.value) return events.value
  return events.value.filter(e => e.id !== featuredEvent.value.id)
})

// باز و بسته کردن مودال
const openEvent = (event: any) => {
  selectedEvent.value = event
  document.body.style.overflow = 'hidden' // جلوگیری از اسکرول صفحه اصلی
}

const closeEvent = () => {
  selectedEvent.value = null
  document.body.style.overflow = '' // آزاد کردن اسکرول
}

// توابع کمکی
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