<template>
  <div class="min-h-screen bg-black pb-20 pt-30 px-4">
    
    <!-- <div class="container-center mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white flex items-center gap-2">
        <span class="i-heroicons-tag text-pink-500"></span>
        مدیریت دسته‌بندی‌ها
      </h1>
      <NuxtLink to="/admin" class="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
        <span>داشبورد</span>
        <span class="i-heroicons-arrow-left"></span>
      </NuxtLink>
    </div> -->

    <div class="container-center grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div>
        <div class="glass-panel p-6 border border-white/10 sticky top-6">
          <h2 class="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
            {{ isEditing ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید' }}
          </h2>
          
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="text-xs text-gray-400 mb-1 block">عنوان دسته</label>
              <input v-model="form.title" type="text" required placeholder="مثال: گیتار فلامنکو" class="w-[75%] bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-pink-500 outline-none">
            </div>

            <div class="flex gap-2 pt-2">
              <button type="submit" :disabled="loading" class="flex-1 btn-primary bg-pink-600 hover:bg-pink-700 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2">
                <span v-if="loading" class="i-heroicons-arrow-path animate-spin"></span>
                {{ isEditing ? 'ذخیره تغییرات' : 'ثبت دسته' }}
              </button>
              <button v-if="isEditing" type="button" @click="resetForm" class="px-4 py-2 border border-white/20 rounded-lg text-black hover:bg-white/10 text-sm">
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="space-y-3">
        <div v-if="fetching" class="text-center py-10 text-gray-500">در حال دریافت...</div>
        
        <div v-else-if="categories.length > 0" v-for="cat in categories" :key="cat.id" class="glass-panel p-4 flex justify-between items-center border border-white/10 hover:border-pink-500/30 transition-colors">
          <span class="text-white font-bold">{{ cat.title }}</span>
          <div class="flex gap-2">
            <button @click="editCategory(cat)" class="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
              ویرایش
            </button>
            <button @click="deleteCategory(cat.id)" class="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
              حذف
            </button>
          </div>
        </div>

        <div v-else class="text-center py-10 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
          دسته بندی وجود ندارد.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const client = useSupabaseClient()

const categories = ref([])
const loading = ref(false)
const fetching = ref(true)
const isEditing = ref(false)
const editId = ref(null)
const form = reactive({ title: '' })

const fetchData = async () => {
  fetching.value = true
  const { data } = await client.from('class_categories').select('*').order('created_at', { ascending: false })
  categories.value = data || []
  fetching.value = false
}

const saveCategory = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      await client.from('class_categories').update({ title: form.title }).eq('id', editId.value)
    } else {
      await client.from('class_categories').insert({ title: form.title })
    }
    resetForm()
    fetchData()
  } catch (error) {
    alert('خطا در عملیات')
  } finally {
    loading.value = false
  }
}

const editCategory = (cat: any) => {
  isEditing.value = true
  editId.value = cat.id
  form.title = cat.title
}

const deleteCategory = async (id: number) => {
  if (!confirm('با حذف دسته، کلاس‌های متصل به آن بدون دسته می‌شوند. ادامه می‌دهید؟')) return
  await client.from('class_categories').delete().eq('id', id)
  fetchData()
}

const resetForm = () => {
  isEditing.value = false
  editId.value = null
  form.title = ''
}

onMounted(() => fetchData())
</script>