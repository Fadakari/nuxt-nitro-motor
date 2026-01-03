<template>
  <div class="min-h-screen bg-black pb-20 pt-30 px-4">
    
    <!-- <div class="container-center mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white flex items-center gap-2">
        <span class="i-heroicons-calendar text-purple-400"></span>
        مدیریت رویدادها
      </h1>
      <NuxtLink to="/admin" class="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
        <span>داشبورد</span>
        <span class="i-heroicons-arrow-left"></span>
      </NuxtLink>
    </div> -->

    <div class="container-center grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1">
        <div class="glass-panel p-6 sticky top-6 border border-white/10">
            <OverlayLoader 
              v-if="loading" 
              type="loading" 
              message="در حال ذخیره اطلاعات..." 
            />
            <OverlayLoader 
              v-if="uploading" 
              type="upload" 
              :progress="uploadProgress" 
            />
          <h2 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
            {{ isEditing ? 'ویرایش رویداد' : 'ثبت رویداد جدید' }}
          </h2>

          <form @submit.prevent="saveEvent" class="space-y-4">
  
          <div>
            <label class="text-xs text-gray-400 mb-1 block">عنوان رویداد</label>
            <input v-model="form.title" type="text" required class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none">
          </div>
        
          <div>
            <label class="text-xs text-gray-400 mb-1 block">خلاصه (برای کارت)</label>
            <textarea v-model="form.description" rows="2" required class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none text-sm"></textarea>
          </div>
        
          <div>
            <label class="text-xs text-gray-400 mb-1 block">توضیحات کامل و جزئیات</label>
            <textarea v-model="form.content" rows="6" class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none text-sm leading-relaxed" placeholder="متن کامل خبر یا جزئیات کنسرت..."></textarea>
          </div>
        
          <div>
            <label class="text-xs text-gray-400 mb-1 block">تاریخ برگزاری</label>
            <div class="relative">
              <input 
                v-model="form.event_date" 
                type="datetime-local" 
                required 
                class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none text-left dir-ltr"
              >
              </div>
          </div>
        
          <div>
            <label class="text-xs text-gray-400 mb-1 block">تصویر کاور</label>
            <div class="flex items-center gap-4">
              <div v-if="form.image_url" class="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20">
                <img :src="getPublicUrl(form.image_url)" class="w-full h-full object-cover">
                <button type="button" @click="form.image_url = ''" class="absolute inset-0 bg-black/50 flex items-center justify-center text-red-500 opacity-0 hover:opacity-100 transition-opacity">
                  <span class="i-heroicons-trash"></span>
                </button>
              </div>
              <label class="flex-1 cursor-pointer">
                <div class="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-white/20 rounded-xl hover:bg-white/5 transition-colors text-gray-400 text-sm">
                  <span v-if="uploading" class="i-heroicons-arrow-path animate-spin"></span>
                  <span v-else class="i-heroicons-cloud-arrow-up"></span>
                  <span>{{ uploading ? 'آپلود...' : 'انتخاب تصویر' }}</span>
                </div>
                <input type="file" accept="image/*" class="hidden" @change="handleFileUpload">
              </label>
            </div>
          </div>
        
          <div class="flex items-center gap-2 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
              <input type="checkbox" v-model="form.is_important" id="impCheck" class="w-4 h-4 accent-purple-500">
              <label for="impCheck" class="text-sm text-purple-200 cursor-pointer select-none font-bold">نمایش ویژه در صفحه اصلی؟</label>
          </div>
        
          <div class="flex gap-2 pt-2">
            <button type="submit" :disabled="loading" class="flex-1 btn-primary bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2">
              {{ isEditing ? 'بروزرسانی' : 'انتشار رویداد' }}
            </button>
            <button v-if="isEditing" type="button" @click="resetForm" class="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 text-sm">
              انصراف
            </button>
          </div>
        </form>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        
        <div v-if="fetching" class="space-y-4">
           <div v-for="i in 3" :key="i" class="glass-panel h-24 animate-pulse bg-white/5 border border-white/10"></div>
        </div>

        <div v-else-if="events.length > 0" class="grid grid-cols-1 gap-4">
          <div v-for="ev in events" :key="ev.id" class="glass-panel p-4 flex gap-4 items-center border border-white/10">
            <div class="w-24 h-24 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 relative">
                <img v-if="ev.image_url" :src="getPublicUrl(ev.image_url)" class="w-full h-full object-cover">
                <div v-if="ev.is_important" class="absolute top-0 right-0 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-bl-lg">ویژه</div>
             </div>

             <div class="flex-1">
               <h3 class="font-bold text-white text-lg mb-1">{{ ev.title }}</h3>
               <p class="text-gray-400 text-xs line-clamp-2 mb-2">{{ ev.description }}</p>
               <div class="text-gray-500 text-xs flex items-center gap-1">
                 <span class="i-heroicons-calendar"></span>
                 {{ new Date(ev.event_date).toLocaleDateString('fa-IR') }}
               </div>
             </div>

             <div class="flex flex-col gap-2">
               <button @click="editEvent(ev)" class="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                 ویرایش
               </button>
               <button @click="deleteEvent(ev)" class="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                 حذف
               </button>
             </div>
          </div>
        </div>
        
        <div v-else class="text-center py-10 text-gray-500 bg-white/5 rounded-2xl">
          هنوز رویدادی ثبت نشده است.
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const client = useSupabaseClient()
const uploadProgress = ref(0)
const fetching = ref(true)
const events = ref([])
const loading = ref(false)
const uploading = ref(false)
const isEditing = ref(false)
const editId = ref(null)

const form = reactive({
  title: '',
  slug: '',
  description: '',
  content: '',
  image_url: '',
  event_date: '',
  is_important: false
})

const fetchData = async () => {
    fetching.value = true
  const { data } = await client.from('events').select('*').order('created_at', { ascending: false })
  events.value = data || []
  fetching.value = false
}

const handleFileUpload = async (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  
  uploading.value = true
  uploadProgress.value = 0
  const interval = setInterval(() => {
    if (uploadProgress.value < 90) uploadProgress.value += 10
  }, 200)
  try {
    const ext = file.name.split('.').pop()
    const path = `events/${Date.now()}.${ext}`
    const { error } = await client.storage.from('images').upload(path, file)
    if (error) throw error
    clearInterval(interval)
    uploadProgress.value = 100
    form.image_url = path
    setTimeout(() => { uploading.value = false }, 500)
  } catch(error) { clearInterval(interval)
    uploading.value = false
    alert('خطا در آپلود عکس')
    console.error(error)
 } 
}

const saveEvent = async () => {
  loading.value = true
  try {
    const slug = form.title.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now()
    const eventData = {
      title: form.title,
      slug: isEditing.value ? undefined : slug, // اسلاگ فقط موقع ساخت ساخته شه
      description: form.description,
      content: form.content,
      image_url: form.image_url,
      event_date: form.event_date,
      is_important: form.is_important
    }

    if (isEditing.value) {
      await client.from('events').update(eventData).eq('id', editId.value)
    } else {
      eventData.slug = slug
      await client.from('events').insert(eventData)
    }
    
    resetForm()
    fetchData()
  } catch(e) { console.error(e) }
  finally { loading.value = false }
}

const editEvent = (ev: any) => {
  isEditing.value = true
  editId.value = ev.id
  form.title = ev.title
  form.description = ev.description
  form.content = ev.content
  form.image_url = ev.image_url
  form.is_important = ev.is_important
  // تبدیل تاریخ برای اینپوت
  if (ev.event_date) {
    const date = new Date(ev.event_date)
    // تنظیم فرمت مناسب برای datetime-local
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    form.event_date = date.toISOString().slice(0, 16)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const deleteEvent = async (ev: any) => { // ورودی کل رویداد است
  if (!confirm('حذف شود؟')) return
  
  loading.value = true
  try {
    if (ev.image_url) {
       await client.storage.from('images').remove([ev.image_url])
    }
    await client.from('events').delete().eq('id', ev.id)
    await fetchData()
  } catch(e) { console.error(e) }
  finally { loading.value = false }
}

const resetForm = () => {
  isEditing.value = false
  editId.value = null
  form.title = ''
  form.description = ''
  form.content = ''
  form.image_url = ''
  form.event_date = ''
  form.is_important = false
}

const getPublicUrl = (path: string) => {
  if (!path) return ''
  const { data } = client.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

onMounted(() => fetchData())
</script>