<template>
  <div class="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <div class="relative w-full max-w-sm bg-[#151515] border border-white/20 rounded-xl p-6 shadow-2xl animate-scale-in">
      <h3 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <span class="i-heroicons-plus-circle text-green-500"></span>
        افزودن ساز جدید
      </h3>

      <form @submit.prevent="saveInstrument" class="space-y-4">
        <div>
          <label class="text-xs text-gray-400 mb-1 block">نام ساز</label>
          <input 
            v-model="name" 
            type="text" 
            required 
            placeholder="مثال: کمانچه" 
            class="w-[93%] bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-green-500 outline-none"
            ref="inputRef"
          >
        </div>

        <div class="flex gap-2 pt-2">
          <button type="submit" :disabled="loading" class="flex-1 btn-primary bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2">
            <span v-if="loading" class="i-heroicons-arrow-path animate-spin"></span>
            {{ loading ? 'در حال ثبت...' : 'ثبت ساز' }}
          </button>
          <button type="button" @click="$emit('close')" class="px-4 py-2 border border-white/20 rounded-lg text-black hover:bg-white/10 text-sm">
            انصراف
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'refresh'])
const client = useSupabaseClient()
const name = ref('')
const loading = ref(false)
const inputRef = ref(null)

// فوکوس خودکار روی اینپوت وقتی مودال باز میشه
onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 100)
})

const saveInstrument = async () => {
  if (!name.value.trim()) return
  loading.value = true
  
  try {
    // ساخت یک اسلاگ تصادفی برای جلوگیری از ارور دیتابیس (چون یونیک است)
    const slug = `inst-${Date.now()}`
    
    const { error } = await client
      .from('instruments')
      .insert({ name: name.value, slug: slug })

    if (error) throw error

    // موفقیت
    emit('refresh') // به والد بگو لیست رو آپدیت کنه
    emit('close')   // مودال رو ببند
    
  } catch (error) {
    alert('خطا در ثبت ساز. ممکن است تکراری باشد.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-in {
  animation: scaleIn 0.2s ease-out forwards;
}
</style>