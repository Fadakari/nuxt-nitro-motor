<script setup lang="ts">
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'close'])

const client = useSupabaseClient()
const images = ref([])
const loading = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)

// دریافت لیست تصاویر از پوشه uploads
const fetchImages = async () => {
  loading.value = true
  const { data, error } = await client
    .storage
    .from('images')
    .list('uploads', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

  if (data) {
    // فیلتر کردن فایل‌های سیستمی و ساخت مسیر کامل
    images.value = data
      .filter(x => x.name !== '.emptyFolderPlaceholder')
      .map(x => ({
        name: x.name,
        path: `uploads/${x.name}`, // مسیر نسبی در باکت
        url: client.storage.from('images').getPublicUrl(`uploads/${x.name}`).data.publicUrl
      }))
  }
  loading.value = false
}

// آپلود تصویر جدید
const handleUpload = async (event: any) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  uploadProgress.value = 0
  
  // شبیه‌سازی درصد پیشرفت (چون کلاینت سوپابیس درصد دقیق نمیده)
  const interval = setInterval(() => {
    if (uploadProgress.value < 90) uploadProgress.value += 10
  }, 100)

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    const { error } = await client.storage
      .from('images')
      .upload(filePath, file)

    if (error) throw error

    clearInterval(interval)
    uploadProgress.value = 100
    
    await fetchImages() // رفرش لیست
    
  } catch (error) {
    alert('خطا در آپلود تصویر')
    console.error(error)
  } finally {
    clearInterval(interval)
    uploading.value = false
  }
}

// حذف تصویر
const handleDelete = async (imagePath: string) => {
  if (!confirm('آیا از حذف این تصویر مطمئن هستید؟')) return

  const { error } = await client.storage
    .from('images')
    .remove([imagePath])

  if (!error) {
    await fetchImages()
    // اگر تصویر حذف شده همان تصویر انتخاب شده بود، انتخاب را لغو کن
    if (props.modelValue === imagePath) {
      emit('update:modelValue', '')
    }
  } else {
    alert('خطا در حذف تصویر')
  }
}

// انتخاب تصویر
const selectImage = (imagePath: string) => {
  emit('update:modelValue', imagePath)
  emit('close')
}

onMounted(() => {
  fetchImages()
})
</script>

<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <div class="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
      
      <div class="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <h3 class="text-white font-bold flex items-center gap-2">
          <span class="i-heroicons-photo text-gold"></span>
          مدیریت تصاویر
        </h3>
        <button @click="$emit('close')" class="transition-all rounded-[1rem] p-1 px-3 bg-dark-1 text-red-400 hover:text-white hover:bg-white/30">
          بستن
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 bg-black/50">
        
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="aspect-square bg-white/5 rounded-xl animate-pulse"></div>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <label class="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-gold/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden">
            <input type="file" accept="image/*" class="hidden" @change="handleUpload" :disabled="uploading">
            
            <div v-if="uploading" class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
              <span class="i-heroicons-arrow-path animate-spin text-2xl text-gold mb-2"></span>
              <span class="text-xs text-gold font-mono">{{ uploadProgress }}%</span>
            </div>

            <span class="i-heroicons-cloud-arrow-up text-4xl text-gray-500 group-hover:text-gold transition-colors mb-2"></span>
            <span class="text-xs text-gray-400 group-hover:text-white">آپلود تصویر جدید</span>
          </label>

          <div 
            v-for="img in images" 
            :key="img.path" 
            class="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-gray-900 cursor-pointer hover:border-gold transition-all"
            :class="{ 'ring-2 ring-gold ring-offset-2 ring-offset-black': modelValue === img.path }"
            @click="selectImage(img.path)"
          >
            <img :src="img.url" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
            
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div class="flex gap-2">
                <button 
                  @click.stop="handleDelete(img.path)" 
                  class="w-8 h-8 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                  title="حذف"
                >
                  <span class="i-heroicons-trash text-sm"></span>
                </button>
              </div>
            </div>

            <div v-if="modelValue === img.path" class="absolute top-2 right-2 w-6 h-6 bg-gold text-black rounded-full flex items-center justify-center shadow-lg">
              <span class="i-heroicons-check text-xs font-bold"></span>
            </div>
          </div>

        </div>

        <div v-if="!loading && images.length === 0" class="text-center py-10 text-gray-500">
          هیچ تصویری یافت نشد. اولین تصویر را آپلود کنید.
        </div>

      </div>
    </div>
  </div>
</template>