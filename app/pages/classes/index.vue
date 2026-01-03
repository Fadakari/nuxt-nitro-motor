<template>
  <div class="min-h-screen pt-24 pb-12 px-4 sm:px-6 relative bg-black">
    <div class="container-center relative z-10">
      
      <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">
            <span class="text-primary">کلاس‌های</span> آموزشی
          </h1>
          <p class="text-gray-400 text-sm">دوره‌های تخصصی موسیقی؛ همین حالا آنلاین رزرو کنید.</p>
        </div>
        
        <div class="flex flex-wrap gap-3">
           <select v-model="selectedLevel" class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-primary transition-colors">
            <option value="">همه سطوح</option>
            <option value="مبتدی">مبتدی</option>
            <option value="پیشرفته">پیشرفته</option>
          </select>
           <select v-model="selectedInstrument" class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-primary transition-colors">
            <option value="">همه سازها</option>
            <option v-for="inst in instruments" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
          </select>
        </div>
      </div>

      <div v-if="fetching" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="glass-panel p-6 border-r-4 border-white/5 animate-pulse">
           <div class="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
           <div class="space-y-3 mb-6">
             <div class="h-4 bg-white/5 rounded w-3/4"></div>
             <div class="h-4 bg-white/5 rounded w-1/2"></div>
             <div class="h-4 bg-white/5 rounded w-full"></div>
           </div>
           <div class="h-10 bg-white/10 rounded-xl"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="cls in filteredClasses" 
          :key="cls.id"
          class="glass-panel p-6 hover:bg-white/5 transition-all group border-r-4"
          :class="cls.capacity_status === 'full' ? 'border-r-red-500' : 'border-r-green-500'"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-white group-hover:text-gold transition-colors">{{ cls.title }}</h3>
            <span v-if="cls.capacity_status === 'full'" class="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-lg">تکمیل</span>
            <span v-else class="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">ظرفیت دارد</span>
          </div>

          <div class="space-y-3 text-sm text-gray-400 mb-6">
            <div class="flex items-center gap-2">
              <span class="i-heroicons-user text-gold"></span>
              <span>مدرس: <span class="text-white font-medium">{{ cls.teachers?.full_name }}</span></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="i-heroicons-musical-note text-primary"></span>
              <span>ساز: 
                <span v-for="(rel, idx) in cls.class_instruments" :key="idx" class="ml-1 text-white">
                  {{ rel.instruments?.name }}
                </span>
              </span>
            </div>
            <div class="flex items-center gap-2">
               <span class="i-heroicons-currency-dollar text-green-400"></span>
               <span>{{ Number(cls.price).toLocaleString() }} تومان</span>
            </div>
          </div>

          <button 
            @click="openModal(cls)"
            :disabled="cls.capacity_status === 'full'" 
            class="w-full btn-primary py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cls.capacity_status === 'full' ? 'تکمیل ظرفیت' : 'ثبت نام آنلاین' }}
          </button>
        </div>
      </div>

      <div v-if="!fetching && filteredClasses.length === 0" class="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5 mt-4">
        <p class="text-gray-400">کلاسی با این مشخصات یافت نشد.</p>
      </div>

    </div>

    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal"></div>
        
        <div class="relative glass-panel w-full max-w-md p-6 border border-gold/30 shadow-2xl">
          <button @click="closeModal" class="absolute left-4 top-4 text-gray-400 hover:text-white">
            <span class="i-heroicons-x-mark text-2xl"></span>
          </button>

          <h3 class="text-xl font-bold text-white mb-1">ثبت نام اولیه</h3>
          <p class="text-sm text-gray-400 mb-6">برای کلاس: <span class="text-gold">{{ selectedClass?.title }}</span></p>

          <form @submit.prevent="submitRegistration" class="space-y-4">
            <div>
              <label class="text-xs text-gray-300 mb-1 block">نام و نام خانوادگی</label>
              <input v-model="form.full_name" type="text" required class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-3 text-white focus:border-gold outline-none" placeholder="نام خود را وارد کنید">
            </div>
            <div>
              <label class="text-xs text-gray-300 mb-1 block">شماره تماس</label>
              <input v-model="form.phone" type="tel" required class="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-3 text-white focus:border-gold outline-none dir-ltr text-right" placeholder="0912...">
            </div>

            <button type="submit" :disabled="submitting" class="w-full btn-primary py-3 rounded-xl font-bold flex justify-center items-center gap-2">
              <span v-if="submitting" class="i-heroicons-arrow-path animate-spin"></span>
              {{ submitting ? 'در حال ثبت...' : 'ثبت درخواست' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const selectedInstrument = ref('')
const selectedLevel = ref('')
const fetching = ref(true)

// متغیرهای مودال
const showModal = ref(false)
const selectedClass = ref(null)
const submitting = ref(false)
const form = reactive({ full_name: '', phone: '' })

// دریافت اطلاعات (با لودینگ)
const { data: instruments } = await useAsyncData('instruments_list', async () => {
  const { data } = await client.from('instruments').select('*')
  return data || []
})

const { data: classes } = await useAsyncData('classes_list', async () => {
  fetching.value = true
  const { data } = await client.from('classes').select(`*, teachers (full_name), class_instruments (instruments (id, name))`).order('created_at', { ascending: false })
  fetching.value = false
  return data || []
})

const filteredClasses = computed(() => {
  if (!classes.value) return []
  return classes.value.filter(c => {
    const matchLevel = selectedLevel.value ? c.level === selectedLevel.value : true
    let matchInstrument = true
    if (selectedInstrument.value) {
      matchInstrument = c.class_instruments?.some((rel: any) => rel.instruments?.id === selectedInstrument.value)
    }
    return matchLevel && matchInstrument
  })
})

// باز کردن مودال
const openModal = (cls: any) => {
  selectedClass.value = cls
  showModal.value = true
  form.full_name = ''
  form.phone = ''
}

const closeModal = () => {
  showModal.value = false
}

// ثبت نام در دیتابیس
const submitRegistration = async () => {
  if (!selectedClass.value) return
  submitting.value = true
  
  try {
    const { error } = await client.from('registrations').insert({
      full_name: form.full_name,
      phone: form.phone,
      class_id: selectedClass.value.id,
      status: 'pending'
    })

    if (error) throw error

    alert('درخواست شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس می‌گیرند.')
    closeModal()
  } catch (error) {
    console.error(error)
    alert('خطایی رخ داد. لطفا دوباره تلاش کنید.')
  } finally {
    submitting.value = false
  }
}
</script>