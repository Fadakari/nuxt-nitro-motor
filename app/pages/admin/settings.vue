<template>
  <div class="min-h-screen bg-black pb-20 pt-6 px-4">
    
    

    <div class="container-center max-w-2xl">
      <div class="glass-panel p-6 border border-white/10">
        
        <form @submit.prevent="saveSettings" class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-400 mb-1 block">آدرس ایمیل</label>
              <input v-model="form.email" type="text" class="input-dark dir-ltr">
            </div>
            <div>
              <label class="text-xs text-gray-400 mb-1 block">ساعات کاری</label>
              <input v-model="form.work_hours" type="text" class="input-dark">
            </div>
          </div>

          <div>
            <label class="text-xs text-gray-400 mb-1 block">آدرس پستی</label>
            <textarea v-model="form.address" rows="2" class="input-dark"></textarea>
          </div>

          <div>
            <label class="text-xs text-gray-400 mb-1 block">روزهای تعطیل</label>
            <input v-model="form.closed_days" type="text" placeholder="مثال: جمعه‌ها" class="input-dark">
          </div>

          <div class="border-t border-white/10 pt-4">
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs text-gray-400 block">شماره‌های تماس</label>
              <button type="button" @click="addPhone" class="text-xs bg-dark-1 rounded-xl text-green-400 hover:text-green-300 flex items-center gap-1">
                <span class="i-heroicons-plus"></span> افزودن
              </button>
            </div>
            <div class="space-y-2">
              <div v-for="(phone, index) in form.phones" :key="index" class="flex gap-2">
                <input v-model="form.phones[index]" type="text" class="input-dark dir-ltr" placeholder="021...">
                <button type="button" @click="removePhone(index)" class="bg-dark-1 rounded-xl text-red-500 hover:text-red-400 px-2">
                  حذف
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-white/10 pt-4">
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs text-gray-400 block">شبکه‌های اجتماعی</label>
              <button type="button" @click="addSocial" class="text-xs bg-dark-1 rounded-xl text-green-400 hover:text-green-300 flex items-center gap-1">
                <span class="i-heroicons-plus"></span> افزودن
              </button>
            </div>
            <div class="space-y-3">
              <div v-for="(social, index) in form.socials" :key="index" class="flex gap-2 items-center bg-white/5 p-2 rounded-lg">
                
                <select v-model="social.platform" class="bg-black border border-white/20 rounded px-2 py-2 text-white text-xs outline-none">
                  <option value="instagram">اینستاگرام</option>
                  <option value="telegram">تلگرام</option>
                  <option value="whatsapp">واتساپ</option>
                  <option value="youtube">یوتیوب</option>
                  <option value="twitter">توییتر/ایکس</option>
                </select>

                <input v-model="social.link" type="text" class="input-dark dir-ltr flex-1 text-xs" placeholder="Link...">
                
                <button type="button" @click="removeSocial(index)" class="bg-dark-1 rounded-xl text-red-500 hover:text-red-400 px-2">
                  حذف
                </button>
              </div>
            </div>
          </div>

          <button type="submit" :disabled="loading" class="w-full btn-primary py-3 rounded-xl font-bold flex justify-center items-center gap-2 mt-6">
            <span v-if="loading" class="i-heroicons-arrow-path animate-spin"></span>
            {{ loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const client = useSupabaseClient()
const loading = ref(false)

const form = reactive({
  id: null,
  address: '',
  email: '',
  work_hours: '',
  closed_days: '',
  phones: [] as string[],
  socials: [] as { platform: string, link: string }[]
})

// دریافت اطلاعات فعلی
const fetchInfo = async () => {
  const { data } = await client.from('site_info').select('*').single()
  if (data) {
    form.id = data.id
    form.address = data.address
    form.email = data.email
    form.work_hours = data.work_hours
    form.closed_days = data.closed_days
    form.phones = data.phones || []
    form.socials = data.socials || []
  }
}

// ذخیره
const saveSettings = async () => {
  loading.value = true
  try {
    const payload = { ...form }
    // اگر ردیفی هست آپدیت کن، اگر نه بساز (ولی ما پیش‌فرض ساختیم پس آپدیت میکنه)
    if (form.id) {
      await client.from('site_info').update(payload).eq('id', form.id)
    } else {
      await client.from('site_info').insert(payload)
    }
    alert('تنظیمات ذخیره شد')
  } catch (error) {
    alert('خطا در ذخیره')
  } finally {
    loading.value = false
  }
}

// توابع کمکی
const addPhone = () => form.phones.push('')
const removePhone = (idx: number) => form.phones.splice(idx, 1)

const addSocial = () => form.socials.push({ platform: 'instagram', link: '' })
const removeSocial = (idx: number) => form.socials.splice(idx, 1)

onMounted(() => fetchInfo())
</script>

<style scoped>
.input-dark {
  width: 93%;
  background-color: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: white;
  outline: none;
}
.input-dark:focus {
  border-color: #CCA43B;
}
</style>