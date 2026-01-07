<template>
  <div class="min-h-screen bg-black pb-30 pt-20 px-4">
    
    <!-- <div class="container-center mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white flex items-center gap-2">
        <span class="i-heroicons-user-group text-gold"></span>
        مدیریت اساتید
      </h1>
      <NuxtLink to="/admin" class="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
        <span>داشبورد</span>
        <span class="i-heroicons-arrow-left"></span>
      </NuxtLink>
    </div> -->

    <div class="container-center grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1">
        <div class="glass-panel p-6 sticky top-6 border border-white/10 relative overflow-hidden">
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
            {{ isEditing ? 'ویرایش استاد' : 'افزودن استاد جدید' }}
          </h2>

          <form @submit.prevent="saveTeacher" class="space-y-4">
            
            <div>
              <label class="text-xs text-gray-400 mb-1 block">نام و نام خانوادگی</label>
              <input v-model="form.full_name" type="text" required class="w-[75%] bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-gold outline-none" placeholder="مثال: استاد شجریان">
            </div>

            <div>
              <label class="text-xs text-gray-400 mb-1 block">بیوگرافی کوتاه</label>
              <textarea v-model="form.bio" rows="3" class="w-[75%] bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-gold outline-none text-sm"></textarea>
            </div>

            <div>
              <label class="text-xs text-gray-400 mb-2 block">تخصص‌ها (سازها)</label>
              <div class="flex flex-wrap gap-2 bg-black/30 p-3 rounded-lg border border-white/10 max-h-40 overflow-y-auto">
                <label 
                  v-for="inst in instruments" 
                  :key="inst.id" 
                  class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white"
                >
                  <input type="checkbox" :value="inst.id" v-model="form.instrument_ids" class="accent-gold w-4 h-4 rounded">
                  {{ inst.name }}
                </label>
              </div>
            </div>

            <div>
              <label class="text-xs text-gray-400 mb-1 block">تصویر پروفایل</label>
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
                    <span>{{ uploading ? 'در حال آپلود...' : 'انتخاب عکس جدید' }}</span>
                  </div>
                  <input type="file" accept="image/*" class="hidden" @change="handleFileUpload">
                </label>
              </div>
            </div>

            <div class="flex items-center gap-2">
               <input type="checkbox" v-model="form.is_active" id="activeCheck" class="w-4 h-4 accent-green-500">
               <label for="activeCheck" class="text-sm text-white cursor-pointer select-none">نمایش در سایت</label>
            </div>

            <div class="flex gap-2 pt-2">
              <button type="submit" :disabled="loading" class="flex-1 btn-primary py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2">
                <span v-if="loading" class="i-heroicons-arrow-path animate-spin"></span>
                {{ isEditing ? 'ذخیره تغییرات' : 'ثبت استاد' }}
              </button>
              <button v-if="isEditing" type="button" @click="resetForm" class="px-4 py-2 border border-white/20 rounded-lg text-black hover:bg-white/10 text-sm">
                انصراف
              </button>
            </div>

          </form>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        
        <div v-if="fetching" class="space-y-4">
          <div v-for="i in 3" :key="i" class="glass-panel p-4 flex gap-4 items-center border border-white/5 animate-pulse">
            <div class="w-20 h-20 rounded-2xl bg-white/10"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-white/10 rounded w-1/3"></div>
              <div class="h-3 bg-white/5 rounded w-1/4"></div>
            </div>
          </div>
        </div>

        <div v-else-if="teachers.length > 0" class="space-y-4">
          <div v-for="teacher in teachers" :key="teacher.id" class="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start border border-white/10 group hover:border-gold/30 transition-colors">
            
            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-800 flex-shrink-0">
              <img v-if="teacher.image_url" :src="getPublicUrl(teacher.image_url)" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                <span class="i-heroicons-user text-3xl"></span>
              </div>
            </div>

            <div class="flex-1 text-center sm:text-right">
              <h3 class="font-bold text-white text-lg flex items-center justify-center sm:justify-start gap-2">
                {{ teacher.full_name }}
                <span v-if="!teacher.is_active" class="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">غیرفعال</span>
              </h3>
              
              <div class="flex flex-wrap justify-center sm:justify-start gap-1 my-2">
                <span v-for="rel in teacher.teacher_instruments" :key="rel.instruments?.id" class="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                  {{ rel.instruments?.name }}
                </span>
              </div>
              
              <p class="text-xs text-gray-500 line-clamp-1">{{ teacher.bio }}</p>
            </div>

            <div class="flex sm:flex-col gap-2 w-full sm:w-auto">
              <button @click="editTeacher(teacher)" class="flex-1 sm:flex-none bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors border border-blue-500/20">
                ویرایش
              </button>
              <button @click="deleteTeacher(teacher)" class="flex-1 sm:flex-none bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors border border-red-500/20">
                حذف
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-10 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
          <span class="i-heroicons-inbox text-4xl mb-2 opacity-50"></span>
          <p>هنوز استادی ثبت نشده است.</p>
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
// استیت‌ها
const teachers = ref([])
const instruments = ref([])
const loading = ref(false)
const uploading = ref(false)
const isEditing = ref(false)
const editId = ref(null)

// فرم
const form = reactive({
  full_name: '',
  bio: '',
  image_url: '',
  is_active: true,
  instrument_ids: [] as number[] // آرایه‌ای از آیدی سازها
})

// ۱. دریافت اطلاعات اولیه (اساتید و سازها)
const fetchData = async () => {
    fetching.value = true
  // گرفتن سازها
  const { data: instData } = await client.from('instruments').select('*')
  instruments.value = instData || []

  // گرفتن اساتید با رابطه‌ها
  const { data: techData } = await client
    .from('teachers')
    .select('*, teacher_instruments(instruments(id, name))')
    .order('created_at', { ascending: false })
  
  teachers.value = techData || []
  fetching.value = false
}

// ۲. آپلود عکس
// این تابع جایگزین تابع handleFileUpload قبلی شود
const handleFileUpload = async (e: any) => {
  const file = e.target.files[0]
  if (!file) return

  uploading.value = true
  uploadProgress.value = 0 // ریست کردن درصد

  // --- بخش جدید: شبیه‌سازی پر شدن درصد ---
  const interval = setInterval(() => {
    if (uploadProgress.value < 90) uploadProgress.value += 10
  }, 200)
  // ---------------------------------------

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `teachers/${fileName}`

    const { error: uploadError } = await client.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // پاک کردن تایمر و پر کردن صد در صد
    clearInterval(interval)
    uploadProgress.value = 100 
    form.image_url = filePath
    
    // یک مکث کوتاه تا کاربر ۱۰۰٪ را ببیند بعد بسته شود
    setTimeout(() => { uploading.value = false }, 500)

  } catch (error) {
    clearInterval(interval) // قطع تایمر در صورت خطا
    uploading.value = false
    alert('خطا در آپلود عکس')
    console.error(error)
  }
}
// ۳. ذخیره (افزودن یا ویرایش)
const saveTeacher = async () => {
  loading.value = true
  try {
    let teacherId = editId.value

    const teacherData = {
      full_name: form.full_name,
      bio: form.bio,
      image_url: form.image_url,
      is_active: form.is_active
    }

    if (isEditing.value && teacherId) {
      // --- آپدیت ---
      const { error } = await client.from('teachers').update(teacherData).eq('id', teacherId)
      if (error) throw error
    } else {
      // --- ایجاد جدید ---
      const { data, error } = await client.from('teachers').insert(teacherData).select().single()
      if (error) throw error
      teacherId = data.id
    }

    // --- مدیریت سازها (رابطه چند به چند) ---
    // اول همه روابط قبلی رو پاک میکنیم (روش تنبل ولی امن)
    await client.from('teacher_instruments').delete().eq('teacher_id', teacherId)
    
    // بعد جدیدها رو اضافه میکنیم
    if (form.instrument_ids.length > 0) {
      const relations = form.instrument_ids.map(instId => ({
        teacher_id: teacherId,
        instrument_id: instId
      }))
      await client.from('teacher_instruments').insert(relations)
    }

    resetForm()
    await fetchData() // لیست رو رفرش کن
    
  } catch (error) {
    alert('خطا در ذخیره اطلاعات')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// ۴. آماده‌سازی فرم برای ویرایش
const editTeacher = (teacher: any) => {
  isEditing.value = true
  editId.value = teacher.id
  form.full_name = teacher.full_name
  form.bio = teacher.bio
  form.image_url = teacher.image_url
  form.is_active = teacher.is_active
  
  // استخراج آیدی سازهای فعلی استاد
  form.instrument_ids = teacher.teacher_instruments.map((r: any) => r.instruments.id)
  
  // اسکرول به بالا (در موبایل مهمه)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ۵. حذف استاد
const deleteTeacher = async (teacher: any) => {
  if (!confirm('آیا از حذف این استاد و تصویر ایشان مطمئن هستید؟')) return
  
  loading.value = true
  try {
    if (teacher.image_url) {
      await client.storage.from('images').remove([teacher.image_url])
    }

    const { error } = await client.from('teachers').delete().eq('id', teacher.id)
    if (error) throw error

    await fetchData()

  } catch (error) {
    alert('خطا در حذف استاد')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// ریست کردن فرم
const resetForm = () => {
  isEditing.value = false
  editId.value = null
  form.full_name = ''
  form.bio = ''
  form.image_url = ''
  form.is_active = true
  form.instrument_ids = []
}

// تابع کمکی url عکس
const getPublicUrl = (path: string) => {
  if (!path) return ''
  const { data } = client.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

onMounted(() => {
  fetchData()
})
</script>