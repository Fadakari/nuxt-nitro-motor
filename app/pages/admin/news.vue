<template>
  <div class="min-h-screen bg-black pb-20 pt-30 px-4">

    <div class="container-center grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1">
        <div class="glass-panel p-6 sticky top-6 border border-white/10 relative overflow-hidden">
          <h2 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
            {{ isEditing ? 'ویرایش خبر' : 'ثبت اطلاعیه جدید' }}
          </h2>

          <form @submit.prevent="saveNews" class="space-y-4">
            
            <div>
              <label class="text-xs text-gray-400 mb-1 block">عنوان اطلاعیه</label>
              <input v-model="form.title" type="text" required class="w-[93%] bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-red-500 outline-none" placeholder="مثال: لغو کلاس‌های پیانو">
            </div>

            <div>
              <label class="text-xs text-gray-400 mb-1 block">متن کامل</label>
              <textarea v-model="form.content" rows="4" class="w-[93%] bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-red-500 outline-none text-sm"></textarea>
            </div>

            <div>
              <label class="text-xs text-gray-400 mb-1 block">اولویت نمایش</label>
              <select v-model="form.priority" class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-red-500 outline-none">
                <option :value="0">عادی (پایین لیست)</option>
                <option :value="1">مهم (بالای لیست)</option>
                <option :value="2">فوری (اولین نمایش)</option>
                <option :value="10">پین شده (همیشه اول)</option>
              </select>
            </div>

            <div class="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
               <input type="checkbox" v-model="form.is_active" id="activeCheck" class="w-4 h-4 accent-red-500">
               <label for="activeCheck" class="text-sm text-gray-300 cursor-pointer select-none">نمایش در سایت</label>
            </div>

            <div class="flex gap-2 pt-2">
              <button type="submit" :disabled="loading" class="flex-1 btn-primary bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2">
                <span v-if="loading" class="i-heroicons-arrow-path animate-spin"></span>
                {{ isEditing ? 'ذخیره تغییرات' : 'انتشار خبر' }}
              </button>
              <button v-if="isEditing" type="button" @click="resetForm" class="px-4 py-2 border border-white/20 rounded-lg bg-black text-white hover:bg-white/10 text-sm">
                انصراف
              </button>
            </div>

          </form>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div v-if="fetching" class="text-center py-10 text-gray-500">در حال دریافت...</div>
        
        <div v-else-if="newsList.length > 0" class="space-y-3">
          <div v-for="item in newsList" :key="item.id" class="glass-panel p-4 flex flex-col md:flex-row gap-4 items-start md:items-center border border-white/10 hover:border-red-500/30 transition-colors relative overflow-hidden">
            
            <div class="absolute right-0 top-0 bottom-0 w-1" :class="getPriorityColor(item.priority)"></div>

            <div class="flex-1 pr-3">
              <div class="flex items-center gap-2 mb-1">
                <span v-if="!item.is_active" class="text-[10px] bg-gray-700 px-2 py-0.5 rounded text-gray-300">پیش‌نویس</span>
                <span v-if="item.priority >= 2" class="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded animate-pulse">فوری</span>
                <h3 class="font-bold text-white text-lg">{{ item.title }}</h3>
              </div>
              <p class="text-xs text-gray-400 line-clamp-2">{{ item.content }}</p>
              <div class="text-[10px] text-gray-500 mt-2">
                {{ new Date(item.created_at).toLocaleDateString('fa-IR') }}
              </div>
            </div>

            <div class="flex gap-2 self-end md:self-center">
              <button @click="editNews(item)" class="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                ویرایش
              </button>
              <button @click="deleteNews(item.id)" class="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                حذف
              </button>
            </div>

          </div>
        </div>

        <div v-else class="text-center py-10 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
          هنوز خبری ثبت نشده است.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const client = useSupabaseClient()

const newsList = ref([])
const loading = ref(false)
const fetching = ref(true)
const isEditing = ref(false)
const editId = ref(null)

const form = reactive({
  title: '',
  content: '',
  priority: 0,
  is_active: true
})

const fetchData = async () => {
  fetching.value = true
  const { data } = await client
    .from('news')
    .select('*')
    .order('priority', { ascending: false }) // اولویت بالاتر، اول
    .order('created_at', { ascending: false }) // جدیدترین، اول
  
  newsList.value = data || []
  fetching.value = false
}

const saveNews = async () => {
  loading.value = true
  try {
    const payload = { ...form }
    
    if (isEditing.value) {
      await client.from('news').update(payload).eq('id', editId.value)
    } else {
      await client.from('news').insert(payload)
    }
    resetForm()
    fetchData()
  } catch (e) {
    alert('خطا در ذخیره')
  } finally {
    loading.value = false
  }
}

const editNews = (item: any) => {
  isEditing.value = true
  editId.value = item.id
  form.title = item.title
  form.content = item.content
  form.priority = item.priority
  form.is_active = item.is_active
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const deleteNews = async (id: number) => {
  if (!confirm('حذف شود؟')) return
  await client.from('news').delete().eq('id', id)
  fetchData()
}

const resetForm = () => {
  isEditing.value = false
  editId.value = null
  form.title = ''
  form.content = ''
  form.priority = 0
  form.is_active = true
}

const getPriorityColor = (p: number) => {
  if (p >= 10) return 'bg-purple-500'
  if (p >= 2) return 'bg-red-500'
  if (p >= 1) return 'bg-yellow-500'
  return 'bg-gray-500'
}

onMounted(() => fetchData())
</script>