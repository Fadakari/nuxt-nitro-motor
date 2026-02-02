<template>
  <div class="w-full bg-black text-white overflow-x-hidden relative selection:bg-gold/30">
    
    <div class="relative w-full h-[150dvh] min-h-[600px] overflow-hidden">
      
      <div class="absolute inset-0 z-0">
        <picture v-if="siteInfo" class="block w-full h-full">
          <source 
            v-if="siteInfo.hero_mobile"
            media="(max-width: 768px)" 
            :srcset="getPublicUrl(siteInfo.hero_mobile)" 
          />
          <img 
            :src="siteInfo.hero_desktop ? getPublicUrl(siteInfo.hero_desktop) : '/ourpicture.jpg'" 
            alt="Ozan Academy Atmosphere" 
            class="block w-full h-full object-cover opacity-60"
          />
        </picture>
        <img 
          v-else
          src="/ourpicture.jpg" 
          alt="Ozan Academy Atmosphere" 
          class="block w-full h-full object-cover opacity-60"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
      </div>

      <div class="relative z-10 w-full max-w-7xl mx-auto px-0 h-full flex flex-col justify-center">
        <div class="max-w-3xl space-y-6 space-x-6 animate-fade-in-up mt-10 md:mt-0">
          
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-gold/30 backdrop-blur-md">
            <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse"></span>
            <span class="text-[10px] md:text-xs font-bold tracking-wider text-gold uppercase">استعدادیابی و آموزش حرفه‌ای</span>
          </div>
          
          <h1 class="text-4xl md:text-7xl font-black leading-tight ps-3">
            <span class="block text-white mb-2">صدای هنر،</span>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-gold via-gold-light to-gold drop-shadow-lg leading-normal py-1">
              در اوج ظرافت
            </span>
          </h1>

          <p class="text-base md:text-xl text-gray-300 font-light leading-relaxed max-w-xl ps-3">
            آکادمی موسیقی اوزان؛ جایی که نت‌ها جان می‌گیرند. با برترین اساتید و متد‌های روز دنیا، مسیر هنری خود را آغاز کنید.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <NuxtLink to="/classes" class="btn-primary no-underline flex items-center justify-center gap-3 mx-auto text-base md:text-lg py-3.5 px-8 group w-[75%]">
              <span>شروع ثبت‌نام</span>
              <span class="i-heroicons-arrow-left group-hover:-translate-x-1 transition-transform"></span>
            </NuxtLink>
            <NuxtLink to="/services" class="btn-gold no-underline flex items-center justify-center gap-3 mx-auto text-base md:text-lg py-3.5 px-8 backdrop-blur-sm bg-black/20 w-[75%]">
              <span>مشاهده اساتید</span>
              <span class="i-heroicons-users"></span>
            </NuxtLink>
          </div>
        </div>

        <div class="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in-up delay-200 w-full pb-8 md:pb-0">
            <div class="glass-panel p-5 hover:bg-white/5 transition-colors cursor-default group mx-auto w-[80%]">
              <div class="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span class="i-heroicons-academic-cap text-xl text-gold"></span>
              </div>
              <h3 class="text-lg font-bold text-white mb-1">اساتید برجسته</h3>
              <p class="text-xs text-gray-400 leading-relaxed">آموزش زیر نظر اساتید فارغ‌التحصیل موسیقی.</p>
            </div>
            
            <div class="glass-panel p-5 hover:bg-white/5 transition-colors cursor-default group mx-auto w-[80%]">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span class="i-heroicons-clock text-xl text-primary"></span>
              </div>
              <h3 class="text-lg font-bold text-white mb-1">برنامه منعطف</h3>
              <p class="text-xs text-gray-400 leading-relaxed">انتخاب روز و ساعت کلاس‌ها متناسب با شما.</p>
            </div>

            <div class="glass-panel p-5 hover:bg-white/5 transition-colors cursor-default group mx-auto w-[80%]">
              <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span class="i-heroicons-trophy text-xl text-white"></span>
              </div>
              <h3 class="text-lg font-bold text-white mb-1">مدرک معتبر</h3>
              <p class="text-xs text-gray-400 leading-relaxed">ارائه گواهی پایان دوره معتبر جهت رزومه.</p>
            </div>
        </div>
      </div>
      
      <div class="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/20 blur-[80px] rounded-full pointer-events-none opacity-60"></div>
      <div class="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gold/10 blur-[60px] rounded-full pointer-events-none opacity-60"></div>
    </div>


    <div class="relative z-10 bg-black border-t border-white/10">
      
      <div class="relative w-full py-16 px-4 sm:px-6">
        <div class="w-full max-w-7xl mx-auto relative z-10">
          
          <div class="flex items-center gap-3 mb-8">
            <div class="w-1.5 h-8 bg-red-500 rounded-full animate-pulse"></div>
            <h2 class="text-2xl font-bold text-white">تابلو اعلانات <span class="text-red-500">فوری</span></h2>
          </div>

          <div v-if="newsItems && newsItems.length > 0" class="flex flex-col gap-4">
             <div 
                v-for="item in newsItems" 
                :key="item.id"
                @click="openModal(item)"
                class="cursor-pointer glass-panel p-6 border-l-4 relative overflow-hidden group hover:bg-white/5 transition-all w-full"
                :class="item.priority >= 2 ? 'border-l-red-500 bg-red-500/5' : 'border-l-gold bg-white/5'"
              >
                <span class="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" 
                  :class="item.priority >= 2 ? 'i-heroicons-exclamation-triangle text-red-500' : 'i-heroicons-information-circle text-gold'">
                </span>

                <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <span v-if="item.priority >= 2" class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">فوری</span>
                      <span class="text-gray-500 text-xs flex items-center gap-1">
                        <span class="i-heroicons-calendar"></span>
                        {{ new Date(item.created_at).toLocaleDateString('fa-IR') }}
                      </span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">{{ item.title }}</h3>
                    <p class="text-gray-300 text-sm leading-relaxed max-w-3xl">{{ item.content }}</p>
                  </div>
                  
                  <div v-if="item.priority >= 10" class="shrink-0 hidden md:block">
                    <span class="i-heroicons-star text-gold text-2xl"></span>
                  </div>
                </div>
              </div>
          </div>
          
          <div v-else class="glass-panel p-8 text-center border border-white/10 opacity-70">
            <span class="i-heroicons-check-circle text-4xl text-green-500 mb-3 block mx-auto"></span>
            <p class="text-white font-bold">هیچ اطلاعیه جدیدی وجود ندارد.</p>
            <p class="text-sm text-gray-500">تمامی کلاس‌ها طبق برنامه در حال برگزاری است.</p>
          </div>
        </div>
      </div>

      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-20">
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
             <div v-for="i in 2" :key="i" class="glass-panel h-48 animate-pulse bg-white/5 rounded-2xl"></div>
          </div>
          
          <div v-else-if="events && events.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              v-for="event in events" 
              :key="event.id" 
              @click="openModal(event)"
              class="cursor-pointer group glass-panel flex flex-col sm:flex-row overflow-hidden hover:border-gold/50 transition-all duration-300 w-full"
            >
              <div class="w-full sm:w-2/5 h-48 sm:h-auto relative bg-gray-800 shrink-0">
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

  </div>

  <Transition 
      enter-active-class="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)" 
      enter-from-class="translate-y-full opacity-0" 
      enter-to-class="translate-y-0 opacity-100" 
      leave-active-class="transition duration-300 ease-in" 
      leave-from-class="translate-y-0 opacity-100" 
      leave-to-class="translate-y-full opacity-0"
    >
      <div v-if="selectedItem" class="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden">
        
        <button @click="closeModal" class="absolute top-6 left-6 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/20">
          <span class="i-heroicons-x-mark text-2xl"></span>
        </button>

        <div class="h-[40vh] w-full relative flex-shrink-0 bg-gray-900">
          <img v-if="selectedItem.image_url" :src="getPublicUrl(selectedItem.image_url)" class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex items-center justify-center text-white/10">
            <span class="i-heroicons-photo text-6xl"></span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        <div class="flex-1 overflow-y-auto bg-black pb-20 px-6">
          <div class="w-full max-w-3xl mx-auto py-8">
            <span class="text-gold text-xs font-bold mb-4 block">
              {{ new Date(selectedItem.created_at).toLocaleDateString('fa-IR') }}
            </span>
            <h1 class="text-3xl font-bold text-white mb-8 leading-tight">{{ selectedItem.title }}</h1>
            
            <div class="text-gray-300 leading-9 whitespace-pre-line text-justify text-lg font-light">
              {{ selectedItem.content || selectedItem.description }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
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
/* اضافه کردن استایل برای اسکرول بار زیبا */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #000;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

<script setup lang="ts">
const client = useSupabaseClient()
const selectedItem = ref(null)

const openModal = (item: any) => {
  selectedItem.value = item
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedItem.value = null
  document.body.style.overflow = ''
}

const getPublicUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const { data } = client.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

const { data: newsItems } = await useAsyncData('home_news', async () => {
  const { data } = await client
    .from('news')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(3)
  return data || []
})

const { data: siteInfo } = await useAsyncData('home_site_info', async () => {
  const { data } = await client.from('site_info').select('*').single()
  return data
})

const { data: events, pending } = await useAsyncData('important-events', () => 
  $fetch('/api/events-cached'), 
{
  lazy: true,
  server: false
})
</script>