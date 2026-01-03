<template>
  <div class="min-h-screen bg-black pb-20 pt-30 px-4">
    
    <!-- <div class="container-center mb-6 flex items-center justify-between z-[100] bg-black">
      <h1 class="text-2xl font-bold text-white flex items-center gap-2">
        <span class="i-heroicons-musical-note text-primary"></span>
        مدیریت کلاس‌ها
      </h1>
      <NuxtLink to="/admin" class="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
        <span>داشبورد</span>
        <span class="i-heroicons-arrow-left"></span>
      </NuxtLink>
    </div> -->

    <div class="container-center grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1">
        <div class="glass-panel p-6 sticky top-6 border border-white/10 relative overflow-hidden">
          <OverlayLoader v-if="loading" type="loading" message="در حال ذخیره کلاس..." />
          
          <h2 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
            {{ isEditing ? 'ویرایش کلاس' : 'تعریف کلاس جدید' }}
          </h2>

          <form @submit.prevent="saveClass" class="space-y-4">
            <div>
              <label class="text-xs text-gray-400 mb-1 block">عنوان کلاس</label>
              <input v-model="form.title" type="text" required class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
            </div>
            <div>
              <label class="text-xs text-gray-400 mb-1 block">مدرس کلاس</label>
              <select v-model="form.teacher_id" required class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                <option value="" disabled>انتخاب کنید...</option>
                <option v-for="t in teachersList" :key="t.id" :value="t.id">{{ t.full_name }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-400 mb-2 block">سازهای مرتبط</label>
              <div class="bg-black/30 p-3 rounded-lg border border-white/10 max-h-32 overflow-y-auto grid grid-cols-2 gap-2">
                <label v-for="inst in instrumentsList" :key="inst.id" class="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input type="checkbox" :value="inst.id" v-model="form.instrument_ids" class="accent-primary rounded">
                  {{ inst.name }}
                </label>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-gray-400 mb-1 block">شهریه (تومان)</label>
                <input v-model="form.price" type="number" required class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none text-left dir-ltr">
              </div>
              <div>
                <label class="text-xs text-gray-400 mb-1 block">مدت (دقیقه)</label>
                <input v-model="form.duration_minutes" type="number" placeholder="30" required class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none text-center dir-ltr">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-gray-400 mb-1 block">سطح</label>
                <select v-model="form.level" class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                  <option value="مبتدی">مبتدی</option>
                  <option value="متوسط">متوسط</option>
                  <option value="پیشرفته">پیشرفته</option>
                </select>
              </div>
              <div>
                <label class="text-xs text-gray-400 mb-1 block">وضعیت ثبت‌نام</label>
                <select v-model="form.capacity_status" class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                  <option value="open">باز</option>
                  <option value="full">تکمیل</option>
                </select>
              </div>
            </div>
            <div class="flex gap-2 pt-4">
              <button type="submit" :disabled="loading" class="flex-1 btn-primary py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2">
                {{ isEditing ? 'ذخیره تغییرات' : 'ثبت کلاس جدید' }}
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
          <div v-for="i in 3" :key="i" class="glass-panel p-4 border border-white/5 animate-pulse h-32 relative overflow-hidden">
             <div class="absolute left-0 top-0 bottom-0 w-1 bg-white/10"></div>
             <div class="space-y-3 pl-4">
               <div class="h-6 bg-white/10 rounded w-1/3"></div>
               <div class="h-4 bg-white/5 rounded w-1/2"></div>
               <div class="h-4 bg-white/5 rounded w-1/4"></div>
             </div>
          </div>
        </div>

        <div v-else-if="classes.length > 0" class="space-y-4">
          <div v-for="cls in classes" :key="cls.id" class="glass-panel p-4 border border-white/10 hover:border-primary/30 transition-colors relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1" :class="cls.capacity_status === 'full' ? 'bg-red-500' : 'bg-green-500'"></div>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pl-4">
              <div class="space-y-1">
                <h3 class="font-bold text-white text-lg flex items-center gap-2">
                  {{ cls.title }}
                  <span class="text-xs font-normal bg-white/10 px-2 py-0.5 rounded text-gray-300">{{ cls.level }}</span>
                </h3>
                <div class="text-sm text-gray-400 flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <span class="flex items-center gap-1">
                    <span class="i-heroicons-user text-gold"></span>
                    {{ cls.teachers?.full_name || 'بدون مدرس' }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="i-heroicons-musical-note text-primary"></span>
                    <span v-for="(rel, idx) in cls.class_instruments" :key="idx" class="ml-1">
                      {{ rel.instruments?.name }}
                    </span>
                  </span>
                </div>
                <div class="text-xs text-gray-500 pt-1">
                  شهریه: {{ Number(cls.price).toLocaleString() }} تومان | مدت: {{ cls.duration_minutes }} دقیقه
                </div>
              </div>
              <div class="flex items-center gap-2 self-end sm:self-center">
                <button @click="editClass(cls)" class="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                  ویرایش
                </button>
                <button @click="deleteClass(cls.id)" class="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-10 text-gray-500 bg-white/5 rounded-2xl">
          هنوز کلاسی تعریف نشده است.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const client = useSupabaseClient()

const classes = ref([])
const teachersList = ref([])
const instrumentsList = ref([])
const fetching = ref(true) // <--- متغیر جدید
const loading = ref(false)
const isEditing = ref(false)
const editId = ref(null)

const form = reactive({
  title: '',
  teacher_id: '',
  price: '',
  duration_minutes: '',
  level: 'مبتدی',
  capacity_status: 'open',
  instrument_ids: [] as number[]
})

const fetchData = async () => {
  fetching.value = true // <--- شروع لودینگ
  const { data: tData } = await client.from('teachers').select('id, full_name').eq('is_active', true)
  teachersList.value = tData || []

  const { data: iData } = await client.from('instruments').select('*')
  instrumentsList.value = iData || []

  const { data: cData } = await client
    .from('classes')
    .select(`*, teachers (id, full_name), class_instruments (instruments (id, name))`)
    .order('created_at', { ascending: false })
  
  classes.value = cData || []
  fetching.value = false // <--- پایان لودینگ
}

const saveClass = async () => {
  loading.value = true
  try {
    const classData = {
      title: form.title,
      teacher_id: form.teacher_id,
      price: form.price,
      duration_minutes: form.duration_minutes,
      level: form.level,
      capacity_status: form.capacity_status
    }
    let classId = editId.value
    if (isEditing.value && classId) {
      const { error } = await client.from('classes').update(classData).eq('id', classId)
      if (error) throw error
    } else {
      const { data, error } = await client.from('classes').insert(classData).select().single()
      if (error) throw error
      classId = data.id
    }
    await client.from('class_instruments').delete().eq('class_id', classId)
    if (form.instrument_ids.length > 0) {
      const relations = form.instrument_ids.map(instId => ({
        class_id: classId,
        instrument_id: instId
      }))
      await client.from('class_instruments').insert(relations)
    }
    resetForm()
    await fetchData()
  } catch (error) {
    alert('خطا در ذخیره کلاس')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const editClass = (cls: any) => {
  isEditing.value = true
  editId.value = cls.id
  form.title = cls.title
  form.teacher_id = cls.teacher_id
  form.price = cls.price
  form.duration_minutes = cls.duration_minutes
  form.level = cls.level || 'مبتدی'
  form.capacity_status = cls.capacity_status || 'open'
  form.instrument_ids = cls.class_instruments.map((r: any) => r.instruments.id)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const deleteClass = async (id: number) => {
  if (!confirm('آیا از حذف این کلاس مطمئن هستید؟')) return
  const { error } = await client.from('classes').delete().eq('id', id)
  if (!error) fetchData()
}

const resetForm = () => {
  isEditing.value = false
  editId.value = null
  form.title = ''
  form.teacher_id = ''
  form.price = ''
  form.duration_minutes = ''
  form.level = 'مبتدی'
  form.capacity_status = 'open'
  form.instrument_ids = []
}

onMounted(() => { fetchData() })
</script>