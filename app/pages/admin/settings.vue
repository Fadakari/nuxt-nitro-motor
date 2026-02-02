<template>
  <div class="min-h-screen bg-black pb-20 pt-30 px-4">
    <div class="container-center max-w-2xl">
      <div class="glass-panel p-6 border border-white/10">
        
        <form @submit.prevent="saveSettings" class="space-y-6">
          
          <div class="border-b border-white/10 pb-6 mb-6">
            <h3 class="text-white font-bold mb-4 flex items-center gap-2">
              <span class="i-heroicons-photo text-gold"></span>
              تصاویر صفحه اصلی
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormImagePicker 
                v-model="form.hero_desktop" 
                label="تصویر دسکتاپ (افقی)" 
              />
                        
              <FormImagePicker 
                v-model="form.hero_mobile" 
                label="تصویر موبایل (عمودی)" 
              />
            </div>
            
            <div v-if="uploading" class="text-gold text-xs mt-2 text-center animate-pulse">در حال آپلود تصویر...</div>
          </div>
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
const uploading = ref(false)

const form = reactive({
  id: null,
  address: '',
  email: '',
  work_hours: '',
  closed_days: '',
  phones: [] as string[],
  socials: [] as { platform: string, link: string }[],
  hero_desktop: '', // فیلد جدید
  hero_mobile: ''   // فیلد جدید
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
    form.hero_desktop = data.hero_desktop || ''
    form.hero_mobile = data.hero_mobile || ''
  }
}

// تابع آپلود عکس
const handleUpload = async (event: any, field: 'hero_desktop' | 'hero_mobile') => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `hero-${field}-${Date.now()}.${fileExt}`
    const filePath = `settings/${fileName}`

    const { error: uploadError, data } = await client.storage
      .from('images') // مطمئن شو باکت images داری
      .upload(filePath, file)

    if (uploadError) throw uploadError

    form[field] = filePath
  } catch (error) {
    alert('خطا در آپلود تصویر')
    console.error(error)
  } finally {
    uploading.value = false
  }
}

const getPublicUrl = (path: string) => {
  if (!path) return ''
  const { data } = client.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

// ذخیره
const saveSettings = async () => {
  loading.value = true
  try {
    const payload = { ...form }
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